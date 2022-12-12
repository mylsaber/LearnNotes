# Kubernetes部署

```shell
# 关闭防火墙
systemctl stop firewalld
systemctl disable firewalld

# 关闭selinux
sed -i 's/enforcing/disabled/' /etc/selinux/config #永久
setenforce 0 #临时

# 关闭swap
sed -ri 's/.*swap.*/#&/' /etc/fstab #永久
swapoff -a #临时

# 在master添加hosts
cat >> /etc/hosts << EOF
192.168.172.134 k8s-master
192.168.172.135 k8s-node
EOF

# 设置网桥参数
cat > /etc/sysctl.d/k8s.conf << EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system  #生效

# 时间同步
yum install ntpdate -y
ntpdate time.windows.com

# 安装docker
yum install wget -y # 安装wget工具
wget https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo -O /etc/yum.repos.d/docker-ce.repo # 配docker源
yum install docker-ce-19.03.13 -y #安装docker

#配置docker镜像加速
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://29pj73ca.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker

#启动docker
systemctl enable --now docker

# 配置k8s阿里源
cat > /etc/yum.repos.d/kubernetes.repo << EOF
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF

# 安装kubeadm，kubelet，kubectl
yum install kubelet-1.19.4 kubeadm-1.19.4 kubectl-1.19.4 -y

# 启动kubelet
systemctl enable --now kubelet.service

# 查看kubelet版本
kubelet --version
# kubelet：运行在cluster所有节点，负责启动pod和容器
# kubeadm：用于初始化cluster的一个工具
# kubectl：命令行工具，可以通过它部署和管理应用

# 部署master节点
kubeadm init --apiserver-advertise-address=masterip --image-repository registry.aliyuncs.com/google_containers --kubernetes-version v1.19.4 --service-cidr=10.96.0.0/12 --pod-network-cidr=10.244.0.0/16

# 按照启动命令执行：例如
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# 在node节点执行master节点打印的命令加入集群：例如
kubeadm join 192.168.172.132:6443 --token wa5bif.zfuvbesevdfvf4of --discovery-token-ca-cert-hash sha256:87cf5828d54dd80da13c4b57c57360370ea0267a7cc3991989ca3006cf3e44d8

# 命令过期后重新获取
kubeadm token create –print-join-command

# master节点部署网络插件
wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
kubectl apply -f kube-flannel.yml

# 查看节点
kubectl get nodes
```