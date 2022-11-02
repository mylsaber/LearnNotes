# Kubernetes

## 搭建K8s集群（kubeadm）

```shell
# 关闭防火墙
systemctl stop firevalld
systemctl disable firewalld

# 关闭selinux
sed -i 's/enforcing/disabled/' /etc/selinux/config  # 永久
setenforce 0 # 临时

# 关闭swap
swapoff -a # 临时
sed -ri 's/.*swap.*/#&/' /etc/fstab  # 永久

# 修改主机名
hostnamectl set-hostmane <hostname>

# 在master添加hosts
cat >> /etc/hosts << EOF
192.168.44.141 master
192.168.44.142 node1
192.168.44.143 node2
EOF

# 将桥接的Ipv4流量传递到iptables的链
cat > /etc/sysctl.d/k8s.conf << EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF

sysctl --system # 生效

# 时间同步
yum install ntpdate -y
ntpdate time.windows.com

# 安装docker

# 安装kubeadm，kubelet和kubectl
yum install -y kubelet-1.18.0 kubeadm-1.18.0 kubectl-1.18.0
systemctl enable kubelet

# 部署k8s master
kubeadm init \
--apiserver-advertise-address=192.186.44.141 \
--image-repository registry.aliyuncs.com/google_containers \
--kubernetes-version v1.18.0 \
--service-cidr=10.96.0.0/12 \
--pod-network-cidr=10.244.0.0/16

# 部署CNI网络插件
wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

kubectl get pods -n kube-system
```