# 1 目录结构
linux的文件系统是采用级层式的树状目录结构，在此结构中的最上层是根目录`"/"`，然后再此目录下载创建其他的目录。linux世界里，一切皆文件。

- /bin：（/usr/bin、/usr/local/bin）是Binary的缩写，存放最经常使用的命令。
- /sbin：（/usr/sbin、/usr/local/sbin）存放系统管理员使用的系统管理程序。
- /home：存放普通用户的主目录，在linux中每个用户都有一个自己的目录，一般用用户名命名该目录。
- /root：系统管理员目录。
- /lib：系统开机所需要最基本的动态连接共享库。几乎所有的应用程序都需要用到这些共享库。
- /lost+found：一般为空，当系统非法关机后，这里就存放了一些文件。
- /etc：所有的系统管理所需要的配置文件和子目录。
- /usr：用户的很多应用程序和文件都放在这个目录下，类似于window的program file目录。
- /boot：存放的是启动linux时使用的一些核心文件。
- /proc：虚拟目录，是系统内存的映射，访问这个目录来获取系统信息。
- /srv：Service缩写，存放一些服务启动后需要提取的数据。
- /sys：安装了2.6内核中新出现大的一个文件系统sysfs
- /tmp：存放一些临时文件的。
- /dev：类似于window的设备管理器，把所有的硬件用文件的形式存储。
- /media：linux会自动识别一些设备，例如u盘，会把识别设备挂载到这个目录下。
- /mnt：让用户挂载别的文件系统的，我们可以将外部的存储挂载在/mnt上。
- /opt：给主机额外安装软件所摆放的目录，如安装Oracle数据就可以放在该目录下。
- /usr/local：另外一个给主机额外安装软件的目录，一般是通过编译源码方式安装的程序。
- /var：存放着不断扩充着的东西，习惯将经常修改的目录放在这里。例如各种日志文件。
- /selinux：SELinux是一种安全子系统，它能控制程序只能访问特定文件，有三种工作模式，可以自行设置。
# 2 vim
linux系统会内置vi文本编辑器。vim具有程序编辑的能力，可以看做是vi的增强版本，可以主动的以字体颜色辨别语法的正确性，方便程序设计。代码补全，编译及错误跳转等方便变成的功能，在程序员中被广泛使用。
## 2.1 vim的模式
vi和vim有三种模式：

- 正常模式：打开文档就直接进入了一般模式。在整个模式中，可以移动光标，可以使用【删除字符】或【删除整行】来处理文档内容，也可以使用【复制、粘贴】来处理文档。
- 插入模式：按下i，o，a，r等字母会进入编辑模式。
- 命令行模式：这个模式可以提供相关指令，完成读取、存盘、替换、离开、搜索等操作。

正常模式下按下i，进入编辑模式，编辑模式下按下esc退出到正常模式。正常模式下按下`:`或`/`进入命令模式，按esc退出到正常模式。
## 2.2 vim快捷键
命令模式下：

- 保存退出`:wq`
- 退出`:q`
- 强制退出`:q!`
- 在文件中查找`/关键字`，回车查找，输入`n`查找下一个。
- 设置文件行号`:set nu`，取消行号`:set nonu`。

正常模式下：

- 拷贝当前行`yy`，拷贝当前行向下五行`5yy`，并粘贴。
- 删除当前行`dd`，删除当前行向下5行`5dd`。
- 文档最末行`G`，最开始`gg`。
- 撤销输入`u`。
- 将光标移动到指定行，输入行号，再按`shift+g`。
# 3 开关机

- `shutdown -h now`：立刻关机
- `shutdown -h 1`：1分钟后关机
- `shutdown -r now`：重启
- `halt`：关机
- `reboot`：重启
- `sync`：内存数据同步到磁盘
# 4 用户管理
## 4.1 登录&注销
```shell
su 用户名 # 登录
logout # 注销
exit # 退出当前用户
```
## 4.2 用户
Linux系统是一个多用户多任务的操作系统，任何一个要使用系统资源的用户，都必须首先向系统管理员申请一个账户，然后一个这个账号的身份进入系统。
### 4.2.1 添加用户
```shell
useradd [-d 目录名] 用户名
```
当不指定目录名时，会给默认使用用户名创建用户目录`/home/用户目录`。
### 4.2.2 修改密码
```shell
passwd 用户名
```
### 4.2.3 删除用户
```shell
userdel [-r] 用户名
```
加上`-r`会一起删除用户在`home`下的目录。
### 4.2.4 查询用户信息
```shell
id 用户名
```
### 4.2.5 切换用户
```shell
su 用户名
```
从高权限用户到低权限用户不需要密码，反之需要。
### 4.2.6 查看当前用户
```shell
whoami
who am i
```
### 4.2.7 修改用户
```shell
usermod -d 目录名 用户名 #修改用户主目录，修改前需要用户取得权限
```
## 4.3 用户组
类似于角色，系统可以对有共性的多个用户进行统一管理。
### 4.3.1 新增组
```shell
groupadd 组名
```
### 4.3.2 删除组
```shell
groupdel 组名
```
### 4.3.3 增加用户时直接加上组
```shell
useradd -g 用户组 用户名
```
### 4.3.4 修改用户的组
```shell
usermod -g 用户组 用户名
```
### 4.3.5 用户和组相关文件

- `/etc/passwd`：用户（user）的配置文件，记录用户的各种信息。

 每行含义【用户名:口令:用户标识号:组标识号:注释性描述:主目录:登录Shell】

- `/etc/shadow`：口令的配置文件。

每行含义【登录名:加密口令:最后一次修改时间:最小时间间隔:最大时间间隔:警告时间:不活动时间:失效时间:标志】

- `/etc/group`：组的配置文件，记录Linux包含的组的信息。

每行含义【组名:口令:组标识号:组内用户列表】
# 5 运行级别
运行级别说明：

- 0：关机
- 1：单用户（找回丢失密码）
- 2：多用户状态没有网络服务
- 3：多用户状态有网络服务
- 4：未使用保留给用户
- 5：图形界面
- 6：系统重启

常用运行级别是3和5，也可以指定默认运行级别。
## 5.1 切换运行级别
```shell
init [0123456]
```
## 5.2 指定运行级别
```shell
systemctl get-default #获取系统运行级别
```
```shell
systemctl set-default multi-user.target #设置系统运行级别为3
```
# 6 Linux常用指令
## 6.1 帮助指令
### 6.1.1 man
获取帮助信息
```shell
man [命令或配置文件]
```
案例：查看`ls`命令的帮助信息
```shell
man ls
```
### 6.1.2 help
获取shell内置命令的帮助信息
```shell
help 命令
```
案例：查看`cd`命令的帮助信息
```shell
help cd
```
## 6.2 目录类指令
### 6.2.1 pwd
显示当前目录的绝对路径
### 6.2.2 ls
显示目录的内容
```shell
ls [选项] [目录或是文件]
```

- -a：显示当前目录所有文件和目录，包括隐藏的。
- -l：以列表的方式显示信息
### 6.2.3 cd
切换到指定目录
```shell
cd [参数]
```
`cd ~`:回到自己的主目录，比如root就回到`/root`目录。
`cd ..`：回到当前目录的上级目录。
### 6.2.4 mkdir
用于创建目录
```shell
mkdir [选项] 目录名
```

- -p：创建多级目录。例如`mkdir /home/animal/dog`，如果没有animal目录，并且加-p选项，创建会失败。
### 6.2.5 rmdir
删除目录
```shell
rmdir [选项] 空目录名
```
删除的是空目录，如果目录下有内容时无法删除。如果要删除非空目录，需要加`-rf`选项。
### 6.2.6 touch
创建空文件
```shell
touch 文件名
```
### 6.2.7 cp
拷贝文件到指定目录
```shell
cp [选项] source dest
```

- -r：递归复制整个文件夹。

递归拷贝是，会提示是否覆盖文件，强制覆盖不提示的方法：`/cp -r source dest`。
### 6.2.8 rm
移除文件或目录
```shell
rm [选项] 要删除的文件或目录
```

- -r：递归删除整个文件夹。
- -f：强制删除不提示确认信息。
### 6.2.9 mv
移动文件与目录或者重命名
```shell
mv source dest
```
同目录下是重名，例如`mv cat.txt pig.txt`。
不同目录是移动文件，例如`mv pig.txt /home/animal`
### 6.2.10 cat
查看文件内容，只能浏览文件，不能修改。
```shell
cat [选项] 文件
```

- -n：显示行号。

一般可以带上管道命令`| more`。
### 6.2.11 more
more指令是一个基于vi编辑器的文本过滤器，他以全屏的方式按页显示文本文件的内容。more指令中内置了若干快捷键。

| 操作 | 功能 |
| --- | --- |
| 空格键（space） | 向下翻一页 |
| Enter | 下翻一行 |
| q | 离开，不再显示文件内容 |
| Ctrl+F | 向下滚动一屏 |
| Ctrl+B | 返回上一屏 |
| = | 输出当前行号 |
| :f | 输出文件名和当前行行号 |

### 6.2.12 less
less指令用来分屏查看文件内容，与more类似，但是比more更加强大，支持各种显示终端，less指令在现实文件内容时，并不是一次将整个文件加载之后才显示，而是根据需要加载，对于现实大型文件具有较高的效率。

| 操作 | 功能 |
| --- | --- |
| 空格键（space） | 向下翻动一页 |
| pagedown | 向下翻动一页 |
| pageup | 向上翻动一页 |
| /字符串 | 搜寻[字符串]，n向下查找，N向上查找 |
| ?字符串 | 搜寻[字符串]，n向上查找，N向下查找 |
| q | 离开less显示 |

### 6.2.13 echo
输出内容到控制台
```shell
echo [选项] 输出内容
```
案例：使用echo输出环境变量`echo $PATH`
### 6.2.14 head
用于显示文件的开头部分内容，默认显示前10行内容。
```shell
head [-n 5] 文件
```
`-n 5`：表示显示前5行
### 6.2.15 tail
用于显示文件尾部内容，默认显示最后10行内容。
```shell
tail [-n 5] 文件
```

- -f：实时追踪该文档的所有更新。
### 6.2.16 >和>>
`>`：输出重定向，`>>`追加。
```shell
ls -l > 文件 #列表的内容覆盖写入文件
ls -l >> 文件 #列表的内容追加到文件的末尾
cat 文件1 > 文件2 #将文件1的内容覆盖到文件2中
echo "内容" >> 文件 #将内容追加到文件的末尾
```
### 6.2.17 ln
软链接也称为符号链接，类似于Windows的快捷方式，主要存放了链接其他文件的路径。
```shell
ln -s [原文件或目录] [软链接名]
```
案例：在`/home`目录下创建一个软链接myroot，链接到`/root`目录。
```shell
cd /home && ln -s /root/ myroot
```
### 6.2.18 history
查看已经执行过的历史命令，也可以执行历史命令。
案例1：显示最近使用过的10条历史命令`history 10`。
案例2：执行历史编号为5的历史命令`!5`
## 6.3 时间日期类
### 6.3.1 date
```shell
date #显示当前时间
date +%Y #显示当前年份
date +%m #显示当前月份
date +%d #显示当前日期
date "%Y-%m-%d %H:%M:%S" #显示年月日时分秒
```
设置系统当前时间：
```shell
date -s 字符串时间
```
案例：`date -s 2020-10-20 20:02:10`
### 6.3.2 cal
查看日历
```shell
cal [选项] #不加选项，显示本月日历
```
案例：显示2020年日历`cal 2020`。
## 6.4 搜索查找类
### 6.4.1 find
从指定目录向下递归地遍历其各个子目录，将满足条件的文件或者目录显示在终端上
```shell
find [搜索范围] [选项]
```
| 选项 | 功能 |
| --- | --- |
| -name <查询方式> | 按照指定的文件名查找 |
| -user <用户名> | 查找属于指定用户名的所有文件 |
| -size <文件大小> | 按照指定的文件大小查找文件(+n大于，-n小于，n等于，单位k,M,G) |

案例1：按文件名查找`find /home -name *.txt`。
案例2：按拥有者查找`find /opt -user mylsaber`。
案例3：按大小查找`find /opt +200M`。
### 6.4.2 locate
locate可以快速定位文件路径。locate利用事先建立的文件系统中所有文件名称及路径的locate数据库实现快速定位给定的文件。locate无需遍历整个文件系统，查询速度较快。为保证查询结果的准确度，管理员必须定期更新locate时刻。第一次运行前，必须使用`updatedb`指令创建locate数据库。
```shell
locate 搜索文件
```
### 6.4.3 which
可以查看指令在哪个目录下，比如ls指令在哪个目录下：`which ls`。
### 6.4.4 grep和管道符号|
grep过滤查找，管道符号`|`表示将前一个命令的处理结果输出传递给后面的命令处理。
```shell
grep [选项] 查找内容 源文件
```

- -n：显示匹配行及行号。
- -i：忽略字母大小写。

案例：查找hello.txt文件中yes所在行，并显示行号。
```shell
cat /home/hello.txt |grep -n "yes"
grep -n "yes" /home/hello.txt
```
## 6.5 压缩和解压缩
### 6.5.1 gzip/gunzip
gzip用于压缩文件，gunzip用于解压文件。
```shell
gzip 文件 #只能将文件压缩为.gz文件
gunzip 文件.gz #解压文件
```
### 6.5.2 zip/unzip
```shell
zip [选项] xxx.zip 压缩内容 #压缩文件和目录
unzip [选项] xxx.zip #解压缩文件
```
zip常用选项：

- -r：递归压缩，即压缩目录。

uzip常用选项：

- -d <目录>：指定解压后文件的存放目录。

案例1：将`/home`下所有文件、文件夹压缩成myhome.zip
```shell
zip -r myhome.zip /home/
```
案例2：将myhome.zip解压到`/opt/tmp`目录下。
```shell
uzip -d /opt/tmp/ myhome.zip
```
### 6.5.3 tar
打包指令，最后打包后的文件是`.tar.gz`文件。
```shell
tar [选项] xxx.tar.gz 打包内容 #打包目录，压缩后的文件是.tar.gz
```

- -c：产生.tar打包文件。
- -v：显示详细信息。
- -f：指定压缩后的文件名。
- -z：打包的同时压缩。
- -x：解包.tar文件。

案例1：压缩多个文件，将`/home/pig.txt`和`/home/cat.txt`压缩成pc.tar.gz。
```shell
tar -zcvf pc.tar.gz /home/pig.txt /home/cat.txt
```
案例2：将`/home`文件夹压缩到home.tar.gz。
```shell
tar -zcvf myhome.tar.gz /home/
```
案例3：将pa.tar.gz解压到当前目录。
```shell
tar -zxvf pc.tar.gz
```
案例4：将myhome.tar.gz解压到`/opt/tmp`目录下。
```shell
tar -zxvf myhome.tar.gz -C /opt/tmp
```
# 7 Linux权限
## 7.1 Linux组和组管理
在Linux中的每个用户必须属于一个组，不能独立于组外。在Linux中每个文件都有所有者，所在组，其他组的概念。
### 7.1.2 文件&目录所有者
一般谁创建了该文件，就自然成为该文件的所有者。
**查看文件&目录所有者：**
```shell
ls -ahl
```
**修改文件&目录所有者：**
```shell
chown newowner 文件/目录名 #修改所有者
chown newowner:newgroup 文件/目录名 #修改所有者和所在组
```

- -R：如果是目录，使目录下所有子文件和目录递归生效。
### 7.1.2 文件&目录所在组
当某个用户创建一个文件后，这个文件的所在组就是该用户所在的组。
**修改文件&目录所在组：**
```shell
chgrp newgroup 文件/目录名
```

- -R：如果是目录，使目录下所有子文件和目录递归生效。
### 7.1.3 其他组
除文件所有者和所在组的用户外，系统的其他用户都是文件的其他组。
## 7.2 权限
### 7.2.1 权限详解
`**ls -l**`**中显示内容如下：**
```shell
drwxr-xr-x  11 jiangfangwei  staff         352 10 17 16:42 mylsaber
```

- 第0位确定文件类型（d：目录，-：普通文件，l：链接，c：设备，比如鼠标，b：块设备，比如硬盘）
- 第1-3位确定所有者拥有该文件的权限。
- 第4-6位确定所属组拥有该文件的权限。
- 第7-9位确定其他用户拥有该文件的权限。

**rwx详解：**

- rwx对于普通文件： 
   - r：读。
   - w：写，不代表可以删除，删除需要对该文件目录有写权限。
   - x：可执行。
- rwx对于目录： 
   - r：读。
   - w：写，可以对目录内创建，删除。重命名目录。
   - x：可以进入该目录。
### 7.2.2 chmod修改权限
**通过+、-、=变更权限：**
u：所有者，g：所属组，o：其他用户，a：所有人（u，g，o的总和）
```shell
chmod u=rwx,g=rx,o=x 文件/目录名
chmod o+x 文件/目录名
chmod a-x 文件/目录名
```
**通过数字变更权限：**
可以使用数字表示：r=4，w=2，x=1，因此rwx=4+2+1=7
```
chmod 751 文件/目录名
```
# 8 定时任务调度
## 8.1 crond任务调度
crontab进行定时任务的设置。任务调度是指系统在某个时间指定的特定的命令或程序。
任务调度分类：

- 系统工作：有些工作必须周而复始地执行。如病毒扫描等。
- 用户工作：个别用户希望执行的某些程序，比如mysql数据库的备份。
```shell
crontab [选项]
```
| 选项 | 功能 |
| --- | --- |
| -e | 编辑crontab定时任务 |
| -l | 查询crontab任务 |
| -r | 删除当前用户所有的crontab任务 |

### 8.1.1 设置任务调度
设置任务调度文件：/etc/crontab。
设置个人任务调度：执行`crontab -e`命令，然后输入任务。
案例1：每分钟执行。
```shell
crontab -e
```
```shell
*/1 * * * * ls -l /etc/ > /tmp/to.txt
```
| 项目 | 含义 | 范围 |
| --- | --- | --- |
| 第一个* | 一个小时的第几分钟 | 0-59 |
| 第二个* | 一天中第几个小时 | 0-23 |
| 第三个* | 一个月中第几天 | 1-31 |
| 第四个* | 一年中的第几月 | 1-12 |
| 第五个* | 一周中的星期几 | 0-7（0和7都表示星期日） |

| 特殊符号 | 含义 |
| --- | --- |
| * | 代表任何时间，比如第一个“*”就代表一个小时中每分钟都执行一次 |
| , | 代表不连续时间，比如“0 8,12,16 _ _ *”就代表每天的8,12,16点都执行一次 |
| - | 代表连续的时间范围，比如“0 5 _ _ 1-6”就代表周一到周六凌晨5点执行 |
| */n | 代表每隔多久执行一次，比如“_/10  _ *”就代表每隔10分钟执行一次 |

## 8.2 at定时
at命令是一次性定时计划任务，at的守护进程atd会以后台模式运行，检查作业队列来运行。默认情况下，atd守护进程每60秒检查作业队列。在使用at命令时，要保证atd进程启动。
### 8.2.1 设置定时任务
```shell
at [选项] [时间] # Ctrl+D结束at命令的输入
```
| 选项 | 含义 |
| --- | --- |
| -m | 指定任务完成后，将给用户发送邮件，即使没有标准输出 |
| -I | atq的别名 |
| -d | atrm的别名 |
| -v | 显示任务将被执行的时间 |
| -c | 打印任务的内容到标准输出 |
| -V | 显示版本信息 |
| -q | 使用指定的队列 |
| -f <文件> | 从指定文件读取任务 |
| -t <时间参数> | 以时间参数的形式提交要运行的任务 |

**指定时间的方法：**

- 当天的hh:mm，如果时间过了，第二天执行。
- midnight（深夜），noon（中午），teatime（下午茶，一般4点）
- 12小时制，am（上午）和pm（下午），例如12pm。
- 指定具体日期，month day、mm/dd/yy、dd.mm.yy等。日期必须在时间后，例如：04:00 2023-03-01。
- 相对计时，now+count time-units，时间单位有：minutes，hours，days，weeks等。例如now+5minutes表示5分钟后。
- 直接使用today，tomorrow等。
### 8.2.2 查询定时任务
```shell
atq
```
### 8.2.3 删除定时任务
```shell
atrm 任务编号
```
# 9 Linux分区
Linux无论几个分区，归根结底只有一个根目录，一个独立且唯一的文件结构，Linux中每个分区都是用来组成整个文件系统的一部分。
Linux采用了一种叫“载入”的处理方法，它的整个文件系统中包含了一整套的文件和目录，且将一个分区和一个目录联系起来，要载入一个分区将使它的存储空间在一个目录下获得。
## 9.1 查看所有设备挂载
```shell
lsblk -f
```
## 9.2 硬盘分区
### 9.2.1 新建分区
```shell
fdisk /dev/硬盘名
```

- m：显示命令列表
- p：显示磁盘分区，同`fdisk -l`
- n：新增分区
- d：删除分区
- w：写入并保存
- q：退出不保存
### 9.2.2 格式化分区
```shell
mkfs -t ext4 /dev/分区名
```
### 9.2.3 挂载目录
命令行挂载，重启后会失效
```shell
mount /dev/分区名 目录名
```
### 9.2.4 卸载分区
```shell
umount /dev/分区名
umount 挂载目录
```
### 9.2.5 永久挂载
通过修改`/etc/fstab`实现永久挂载，编辑完成后执行`mount -a`生效。
## 9.3 磁盘情况
### 9.3.1 查询系统整体磁盘使用
```shell
df -h
```
### 9.3.2 查询指定目录磁盘占用
```shell
du -h 目录名 #默认当前目录
```

- -s：指定目录占用大小汇总
- -h：带计量单位
- -a：含文件
- --max-depth=1：子目录深度
- -c：列出明细的同时，增加汇总值
### 9.3.3 磁盘实用指令

- `ls -l /opt | grep "^-" | wc -l`：统计/opt文件夹下文件的个数
- `ls -l /opt | grep "^d" | wc -l`：统计/opt文件夹下目录的个数
- `ls -lR /opt | grep "^-" | wc -l`：统计/opt文件夹下文件的个数，包括子文件夹
- `ls -lR /opt | grep "^d" | wc -l`：统计/opt文件夹下目录的个数，包括子文件夹
- `tree 目录名`：树状显示目录结构
# 10 网络配置
## 10.1 主机名
### 10.1.1 查看主机名
```shell
hostname
```
### 10.1.2 修改主机名
```shell
vim /etc/hostname
```
### 10.1.3 修改hosts
```shell
vim /etc/hosts
```
# 11 进程管理
在Linux中，每个执行的程序都称为一个进程，每个进程都分配一个ID号（pid，进程号）。
进程分为前后台进程，一般的系统服务基本都是以后台进程方式存在，常驻系统。
## 11.1 显示系统进程
```shell
ps [选项]
```

- -a：显示当前终端的所有进程信息
- -u：以用户的格式显示进程信息
- -x：显示后台进程运行的参数
- -e：显示所有进程
- -f：全格式，可以查询父进程

一般`-aux`一起用。`-ef`一起使用
**结果详解：**

- USER：用户名称
- PID：进程号
- %CPU：CPU占用百分比
- %MEM：物理内存百分比
- VSZ：虚拟内存大小（单位KB）
- RSS：物理内存大小（单位KB）
- TTY：终端名称
- STAT：进程状态，S-睡眠，s-表示该进程是会话的先导进程，N-表示进程拥有比普通优先级更低的优先级，R-正在运行，D-短期等待，Z-僵死进程，T-被跟踪或者被停止等等
- STARTED：进程的启动时间
- TIME：CPU使用时间
- COMMAND：启动进程所用的命令和参数，过长会被截断显示
## 11.2 终止进程
某个进程执行一半需要停止时，或是已经消耗了很大的系统资源时，可以使用kill命令来停止进程。
```shell
kill [选项] 进程号
```

- -9：强迫进程立即停止。

通过进程名称杀死进程，也支持通配符，在系统负载过大而变得很慢时很有用。
```shell
killall 进程名称
```
## 11.3 pstree进程树
```shell
pstree [选项]
```

- -p：显示进程的PID
- -u：显示进程的所属用户
# 12 服务管理
服务Service本质就是进程，但是是运行在后台的，通常会监听某个端口，等待其他程序的请求，比如（mysql，sshd，防火墙等），因此我们又称为守护进程。
## 12.1 systemctl
### 12.1.1基本语法
```shell
systemctl [start|stop|restart|status] 服务名
```
systemctl指令管理的服务在`/usr/lib/systemd/system`查看。
### 12.1.2 设置自启动
查看服务开机启动状态，可以使用grep过滤：
```shell
systemctl list-unit-files
```
开启/关闭服务开机启动：
```shell
systemctl enable/disable 服务名
```
查询某个服务是否自启动：
```shell
systemctl is-enabled 服务名
```
### 12.1.3 打开或关闭指定端口
打开端口：
```shell
firewall-cmd --permanent --add-port=端口号/协议
```
关闭端口：
```shell
firewall-cmd --permanent --remove-port=端口号/协议
```
生效：
```shell
firewall-cmd --reload
```
查询端口是否开发：
```shell
firewall-cmd --query-port=端口/协议
```
# 13 动态和网络监控
## 13.1 top动态监控
top与ps命令很相似，它们都用来显示正在执行的进程。最大的不同之处在于top在执行一段时间可以更新正在运行的进程。
```shell
top [选项]
```
| 选项 | 功能 |
| --- | --- |
| -d n | 指定top命令每隔几秒更新，默认3秒 |
| -i | 使top不显示任何闲置或者僵死进程 |
| -p | 通过指定监控进程ID来仅仅监控某个进程的状态。 |

交互操作：

| 操作 | 功能 |
| --- | --- |
| P | 以CPU使用率排序，默认 |
| M | 以内存的使用率排序 |
| N | 以PID排序 |
| q | 退出top |

案例1：监视特定用户
输入top命令，回车键，然后输入u，回车键，再输入用户名。
案例2：终止指定的进程
输入top命令，回车键，然后输入k，回车键，再输入要结束的进程ID号。
案例3：指定系统状态更新的时间（10秒）
```shell
top -d 10
```
## 13.1 netstat网络监控
```shell
netstat [选项]
```

- -an：按一定顺序排列输出
- -p：显示那个进程在调用

案例1：查看服务名为sshd的服务信息
```shell
netstat -anp | grep sshd
```
## 13.2 ping
一种网络检测工具，主要是用来检查本机和远程主机是否网络正常。
```shell
ping 对方ip
```
# 14 软件安装
## 14.1 rpm
rpm用户互联网下载包的打包及安装工具，它包含在某些Linux分发版中，它生成具有.rpm扩展名的文件，rpm是RedHat Package Manager的缩写，类似Windows的setup.exe。
### 14.1.1 查询指令
查询所有安装的rpm软件包：
```shell
rpm -qa
```
查询软件包是否安装：
```shell
rpm -q 软件名称
```
查询软件包信息：
```shell
rpm -qi 软件名称
```
查询软件包中的文件：
```shell
rpm -ql 软件名称
```
查询文件所属的软件包：
```shell
rpm -qf 文件名
```
### 14.1.2 卸载rpm包
```shell
rpm -e 软件名称
```
### 14.1.3 安装rpm包
```shell
rpm -ivh rpm包全路径
```

- i=install：安装
- v=verbose：提示
- h=hash：进度条
## 14.2 Yum包管理
Yum是RedHat、CentOS软件包管理，使用Python编写，它是基于RPM包进行管理，能够从指定服务器（源）自动下载RPM包并安装，可以自动处理依赖关系，并且一次安装所有依赖软件包。
### 14.2.1 Yum源配置
Yum仓库包含软件包以及对应的元数据（软件包的信息以及包与包的依赖关系）。Linux系统Yum配置文件有两类

1.  /etc/yum.conf
主动配置文件，一般不需要改动，主要配置RPM包缓存目录，日志文件路径等。 
2.  /etc/yum.repos.d/*.repo
例如：CentOS-Base.repo，一个系统中需要的基础源，base源和epel源（扩展安装包） 

由于都是国外镜像，可以配置成国内的镜像源（[阿里云镜像站](https://developer.aliyun.com/mirror/)；[网易镜像站](http://mirrors.163.com/)；[清华源](https://mirrors.tuna.tsinghua.edu.cn/)；[中科大源](https://mirrors.ustc.edu.cn/)）
配置完成后需要生成新的缓存：
```shell
yum clean all #清理缓存
yum makecache #更新缓存
```
### 14.2.2 语法
```shell
yum [options] [command] [package ...]
```
其中的option是可选的：

- -h：帮助
- -y：安装过程提示自动选择yes
- -q：不显示安装过程
### 14.2.3 常用命令
```shell
yum list |grep xxx
yum install xxx # 安装xxx软件
yum info xxx # 查看xxx软件的信息
yum remove xxx # 删除xxx软件
yum list # 列出软件包
yum clean # 清除缓存和旧的包
yum provides xxx # 以xxx为关键字搜索包（提供的信息为关键字）
yum search xxx # 搜索软件包（以名字为关键字）

yum groupupdate xxx # 更新xxx软件分组
yum grouplist xxx # 列出xxx软件分组 
yum groupremove xxx # 移除xxx软件分组
yum groupinfo xxx # 查看xxx软件分组信息

yum update # 系统升级
yum list available # 列出所有升级源上的包
yum list updates # 列出所有升级源上可以更新的包
yum list installed # 列出已经安装的包
yum update kernel # 升级内核
```
### 14.2.4 更新
```shell
yum check-update # 检查可更新的包
yum update # 更新所有包
yum update xxx #更新指定包xxx
yum groupupdate xxx # 升级程序组xxx
yum upgrade # 大规模的版本升级，连旧的淘汰的包也升级
yum upgrade xxx # 升级程序组xxx
```
### 14.2.5 安装与删除
```shell
yum install xxx # 安装指定包
yum groupinstall xxx # 安装程序组xxx
yum remove xxx # 删除指定包包括依赖。
yum groupremove xxx # 删除程序组xxx
yum deplist xxx # 查看xxx依赖情况
```
### 14.2.6 缓存相关
```shell
yum clean packages # 清除缓存目录的包
yum clearn headers # 清除缓存目录下的headers
yum clean oldheaders # 清除缓存目录下旧的headers
yum clean # 相当于yum clean all，相当于yum clean packages和yum clean oldheaders
```
### 14.2.7 列出包
```shell
yum list # 列出资源库中所有看着或更新的包
yum list xxx # 列出指定包，可以使用通配符，例如firefox*
yum list updates # 列出所有可以更新的包
yum list installed # 列出已经安装的包
yum list extras # 通过其他网站下载安装的包
yum search xxx #根据关键字xxx查找安装包
yum info xxx #显示xxx包信息
yum groupinfo xxx #显示xxx程序组信息
```
