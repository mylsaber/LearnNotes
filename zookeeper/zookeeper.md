## Zookeeper简介

ZooKeeper最为主要的使⽤场景，是作为分布式系统的分布式协同服务。分布式系统的协调⼯作就是通过某种⽅式，让每个节点的信息能够同步和共享。这依赖于服务进程之间 的通信。通信⽅式有两种：

- 通过⽹络进⾏信息共享
- 通过共享存储

ZooKeeper对分布式系统的协调，使⽤的是第⼆种⽅式，共享存储。其实共享存储，分布式应⽤也需要 和存储进⾏⽹络通信。

### zookeeper的基本概念

- 集群⻆⾊

  zookeeper引⼊了Leader、 Follower、Observer三种⻆⾊。Zookeeper集群中的所有机器通过Leader选举来选定⼀台被称为 Leader的机器，Leader服务器为客户端提供读和写服务，除Leader外，其他机器包括Follower和 Observer,Follower和Observer都能提供读服务，唯⼀的区别在于Observer不参与Leader选举过程， 不参与写操作的过半写成功策略，因此Observer可以在不影响写性能的情况下提升集群的性能。

- 会话（session）

  Session指客户端会话，⼀个客户端连接是指客户端和服务端之间的⼀个TCP⻓连接，Zookeeper对外的 服务端⼝默认为2181，客户端启动的时候，⾸先会与服务器建⽴⼀个TCP连接，从第⼀次连接建⽴开 始，客户端会话的⽣命周期也开始了，通过这个连接，客户端能够⼼跳检测与服务器保持有效的会话， 也能够向Zookeeper服务器发送请求并接受响应，同时还能够通过该连接接受来⾃服务器的Watch事件 通知。

- 数据节点（Znode）

  在ZooKeeper中，“节点”分为两类，第⼀类是指构成集群的机器，我们称之为机器节点；第⼆类则是指数据模型中的数据 单元，我们称之为数据节点——ZNode。ZooKeeper将所有数据存储在内存中，数据模型是⼀棵树 （ZNode Tree），由斜杠（/）进⾏分割的路径，就是⼀个Znode，例如/app/path1。每个ZNode上都 会保存⾃⼰的数据内容，同时还会保存⼀系列属性信息。

- 版本

  刚刚我们提到，Zookeeper的每个Znode上都会存储数据，对于每个ZNode，Zookeeper都会为其维护 ⼀个叫作Stat的数据结构，Stat记录了这个ZNode的三个数据版本，分别是version（当前ZNode的版 本）、cversion（当前ZNode⼦节点的版本）、aversion（当前ZNode的ACL版本）。

- Watcher（事件监听器）

  Wathcer（事件监听器），是Zookeeper中⼀个很重要的特性，Zookeeper允许⽤户在指定节点上注册 ⼀些Watcher，并且在⼀些特定事件触发的时候，Zookeeper服务端会将事件通知到感兴趣的客户端， 该机制是Zookeeper实现分布式协调服务的重要特性

- ACL

  Zookeeper采⽤ACL（Access Control Lists）策略来进⾏权限控制，其定义了如下五种权限： 　　　

  - CREATE：创建⼦节点的权限
  - READ：获取节点数据和⼦节点列表的权限
  - WRITE：更新节点数据的权限
  - DELETE：删除⼦节点的权限
  - ADMIN：设置节点ACL的权限。

  其中需要注意的是，CREATE和DELETE这两种权限都是针对⼦节点的权限控制

## Zookeeper基本使⽤

### ZooKeeper系统模型

#### ZooKeeper数据模型Znode

在ZooKeeper中，数据信息被保存在⼀个个数据节点上，这些节点被称为znode。ZNode 是 Zookeeper 中最⼩数据单位，在 ZNode 下⾯⼜可以再挂 ZNode，这样⼀层层下去就形成了⼀个层次化 命名空间 ZNode 树，我们称为 ZNode Tree，它采⽤了类似⽂件系统的层级树状结构进⾏管理。ZNode的节 点路径标识⽅式和Unix⽂件系统路径⾮常相似，都是由⼀系列使⽤斜杠（/）进⾏分割的路径表示，开 发⼈员可以向这个节点写⼊数据，也可以在这个节点下⾯创建⼦节点。

#### ZNode 的类型

Zookeeper 节点类型可以分为三⼤类： 

- 持久性节点（Persistent）
- 临时性节点（Ephemeral）
- 顺序性节点（Sequential）

在开发中在创建节点的时候通过组合可以⽣成以下四种节点类型：持久节点、持久顺序节点、临时节 点、临时顺序节点。不同类型的节点则会有不同的⽣命周期

**持久节点**：是Zookeeper中最常⻅的⼀种节点类型，所谓持久节点，就是指节点被创建后会⼀直存在服 务器，直到删除操作主动清除

**持久顺序节点**：就是有顺序的持久节点，节点特性和持久节点是⼀样的，只是额外特性表现在顺序上。 顺序特性实质是在创建节点的时候，会在节点名后⾯加上⼀个数字后缀，来表示其顺序

**临时节点**：就是会被⾃动清理掉的节点，它的⽣命周期和客户端会话绑在⼀起，客户端会话结束，节点 会被删除掉。与持久性节点不同的是，临时节点不能创建⼦节点。 

**临时顺序节点**：就是有顺序的临时节点，和持久顺序节点相同，在其创建的时候会在名字后⾯加上数字 后缀

#### 事务ID

在ZooKeeper中，事务是指能够改变ZooKeeper服务器状态的操作，我们也称之为事务操作或更新操 作，⼀般包括数据节点创建与删除、数据节点内容更新等操作。对于每⼀个事务请求，ZooKeeper都会 为其分配⼀个全局唯⼀的事务ID，⽤ ZXID 来表示，通常是⼀个 64 位的数字。每⼀个 ZXID 对应⼀次更 新操作，从这些ZXID中可以间接地识别出ZooKeeper处理这些更新操作请求的全局顺序

#### ZNode 的状态信息

![](D:\JavaLearn\learn-notes\zookeeper\1.png)

整个 ZNode 节点内容包括两部分：节点数据内容和节点状态信息。图中quota 是数据内容，其他的属 于状态信息。

```
 cZxid 就是 Create ZXID，表示节点被创建时的事务ID。
 ctime 就是 Create Time，表示节点创建时间。
 mZxid 就是 Modified ZXID，表示节点最后⼀次被修改时的事务ID。
 mtime 就是 Modified Time，表示节点最后⼀次被修改的时间。
 pZxid 表示该节点的⼦节点列表最后⼀次被修改时的事务 ID。只有⼦节点列表变更才会更新 pZxid，
⼦节点内容变更不会更新。
 cversion 表示⼦节点的版本号。
 dataVersion 表示内容版本号。
 aclVersion 标识acl版本
 ephemeralOwner 表示创建该临时节点时的会话 sessionID，如果是持久性节点那么值为 0
 dataLength 表示数据⻓度。
 numChildren 表示直系⼦节点数。
```

#### Watcher--数据变更通知

Zookeeper使⽤Watcher机制实现分布式数据的发布/订阅功能

Zookeeper的Watcher机制主要包括客户端线程、客户端WatcherManager、Zookeeper服务器三部 分。 具体⼯作流程为：客户端在向Zookeeper服务器注册的同时，会将Watcher对象存储在客户端的 WatcherManager当中。当Zookeeper服务器触发Watcher事件后，会向客户端发送通知，客户端线程 从WatcherManager中取出对应的Watcher对象来执⾏回调逻辑。

#### ACL--保障数据的安全

权限模式（Scheme）、授权对象（ID）、权限 （Permission），通常使⽤"scheme: id : permission"来标识⼀个有效的ACL信息。

- 权限模式：Scheme

  权限模式⽤来确定权限验证过程中使⽤的检验策略，有如下四种模式：

  - IP

    IP模式就是通过IP地址粒度来进⾏权限控制，如"ip:192.168.0.110"表示权限控制针对该IP地址， 同时IP模式可以⽀持按照⽹段⽅式进⾏配置，如"ip:192.168.0.1/24"表示针对192.168.0.*这个⽹段 进⾏权限控制。

  - Digest

    Digest是最常⽤的权限控制模式，要更符合我们对权限控制的认识，其使 ⽤"username:password"形式的权限标识来进⾏权限配置，便于区分不同应⽤来进⾏权限控制。 当我们通过“username:password”形式配置了权限标识后，Zookeeper会先后对其进⾏SHA-1加密 和BASE64编码。

  - World

    World是⼀种最开放的权限控制模式，这种权限控制⽅式⼏乎没有任何作⽤，数据节点的访问权限 对所有⽤户开放，即所有⽤户都可以在不进⾏任何权限校验的情况下操作ZooKeeper上的数据。 另外，World模式也可以看作是⼀种特殊的Digest模式，它只有⼀个权限标识，即“world： anyone”。

  - Super

    Super模式，顾名思义就是超级⽤户的意思，也是⼀种特殊的Digest模式。在Super模式下，超级 ⽤户可以对任意ZooKeeper上的数据节点进⾏任何操作。

- 授权对象：ID

  授权对象指的是权限赋予的⽤户或⼀个指定实体，例如 IP 地址或是机器等。在不同的权限模式下，授 权对象是不同的，表中列出了各个权限模式和授权对象之间的对应关系。

  |权限模式 |授权对象|
  | ---- | --------------------------------- |
  | IP   | 通常是⼀个IP地址或IP段：例如：192.168.10.110 或192.168.10.1/24 |
  | Digest | ⾃定义，通常是username:BASE64(SHA-1(username:password))例如： zm:sdfndsllndlksfn7c= |
  | Digest | 只有⼀个ID ：anyone |                |
  | Super | 超级⽤户 |
  
- 权限 

  权限就是指那些通过权限检查后可以被允许执⾏的操作。在ZooKeeper中，所有对数据的操作权限分为 以下五⼤类：

  - CREATE（C）：数据节点的创建权限，允许授权对象在该数据节点下创建⼦节点。 
  - DELETE（D）： ⼦节点的删除权限，允许授权对象删除该数据节点的⼦节点。 
  - READ（R）：数据节点的读取权限，允 许授权对象访问该数据节点并读取其数据内容或⼦节点列表等。 
  - WRITE（W）：数据节点的更新权 限，允许授权对象对该数据节点进⾏更新操作。 
  - ADMIN（A）：数据节点的管理权限，允许授权对象 对该数据节点进⾏ ACL 相关的设置操作。

### Zookeeper的api使⽤

Zookeeper作为⼀个分布式框架，主要⽤来解决分布式⼀致性问题，它提供了简单的分布式原语，并且 对多种编程语⾔提供了API，所以接下来重点来看下Zookeeper的java客户端API使⽤⽅式

Zookeeper API共包含五个包，分别为： 

- org.apache.zookeeper 
- org.apache.zookeeper.data 
- org.apache.zookeeper.server
- org.apache.zookeeper.server.quorum
- org.apache.zookeeper.server.upgrade

其中org.apache.zookeeper，包含Zookeeper类，他是我们编程时最常⽤的类⽂件。这个类是 Zookeeper客户端的主要类⽂件。如果要使⽤Zookeeper服务，应⽤程序⾸先必须创建⼀个Zookeeper 实例，这时就需要使⽤此类。⼀旦客户端和Zookeeper服务端建⽴起了连接，Zookeeper系统将会给本 次连接会话分配⼀个ID值，并且客户端将会周期性的向服务器端发送⼼跳来维持会话连接。只要连接有 效，客户端就可以使⽤Zookeeper API来做相应处理了。

#### 添加依赖

```xml
<dependency>
    <groupId>org.apache.zookeeper</groupId>
    <artifactId>zookeeper</artifactId>
    <version>3.7.0</version>
</dependency>
```

#### 建立一个测试连接

```java
package com.mylsaber.zookeeper;

import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;

import java.io.IOException;
import java.util.concurrent.CountDownLatch;

/**
 * @author jfw
 */
public class CreateSession implements Watcher {

    //countDownLatch这个类使⼀个线程等待,主要不让main⽅法结束
    private static final CountDownLatch countDownLatch = new CountDownLatch(1);

    public static void main(String[] args) throws IOException, InterruptedException {
        /*
         客户端可以通过创建⼀个zk实例来连接zk服务器
         new Zookeeper(connectString,sesssionTimeOut,Wather)
         connectString: 连接地址：IP：端⼝
         sesssionTimeOut：会话超时时间：单位毫秒
         Wather：监听器(当特定事件触发监听时，zk会通过watcher通知到客户端)
         */
        ZooKeeper zooKeeper = new ZooKeeper("124.223.91.119:2181", 5000, new CreateSession());
        System.out.println(zooKeeper.getState());
        countDownLatch.await();
        //表示会话真正建⽴
        System.out.println("=========Client Connected to zookeeper==========");

    }

    /*
    当前类实现了Watcher接⼝，重写了process⽅法，该⽅法负责处理来⾃Zookeeper服务端的
    watcher通知，在收到服务端发送过来的SyncConnected事件之后，解除主程序在CountDownLatch上
    的等待阻塞，⾄此，会话创建完毕
    */
    @Override
    public void process(WatchedEvent watchedEvent) {
        //当连接创建了，服务端发送给客户端SyncConnected事件
        if (watchedEvent.getState() == Event.KeeperState.SyncConnected) {
            countDownLatch.countDown();
        }
    }
}
```

#### 创建节点

```java
package com.mylsaber.zookeeper;

import org.apache.zookeeper.*;

import java.io.IOException;
import java.util.concurrent.CountDownLatch;

/**
 * @author jfw
 */
public class CreateSession implements Watcher {
    private static final CountDownLatch countDownLatch = new CountDownLatch(1);
    private static ZooKeeper zooKeeper;

    public static void main(String[] args) throws IOException, InterruptedException {
        zooKeeper = new ZooKeeper("124.223.91.119:2181", 5000, new CreateSession());
        countDownLatch.await();
    }

    @Override
    public void process(WatchedEvent watchedEvent) {
//        String path:节点创建的路径
//        byte[] data:节点创建要保存的数据，是个byte类型的
//        List<ACL > acl:节点创建的权限信息(4种类型)
//                      ANYONE_ID_UNSAFE : 表示任何⼈
//                      AUTH_IDS ：此ID仅可⽤于设置ACL。它将被客户机验证的ID替换。
//                      OPEN_ACL_UNSAFE ：这是⼀个完全开放的ACL(常⽤)-->world:anyone
//                      CREATOR_ALL_ACL ：此ACL授予创建者身份验证ID的所有权限
//        CreateMode createMode：创建节点的类型(4种类型)
//                      PERSISTENT：持久节点
//                      PERSISTENT_SEQUENTIAL：持久顺序节点
//                      EPHEMERAL：临时节点
//                      EPHEMERAL_SEQUENTIAL：临时顺序节点
        try {
            final String node = zooKeeper.create("/zk-persistent", "zkdata".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL);
            System.out.println(node);
        } catch (KeeperException | InterruptedException e) {
            e.printStackTrace();
        }
        countDownLatch.countDown();
    }
}
```

#### 获取节点

```java
package com.mylsaber.zookeeper;

import org.apache.zookeeper.*;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CountDownLatch;

/**
 * @author jfw
 */
public class CreateSession implements Watcher {
    private static final CountDownLatch COUNT_DOWN_LATCH = new CountDownLatch(1);
    private static ZooKeeper zooKeeper;

    public static void main(String[] args) throws IOException, InterruptedException {
        zooKeeper = new ZooKeeper("124.223.91.119:2181", 5000, new CreateSession());
        COUNT_DOWN_LATCH.await();
    }

    @Override
    public void process(WatchedEvent watchedEvent) {
        System.out.println("process执行中....");
        try {
            final byte[] data = zooKeeper.getData("/zk-persistent", false, null);
            final List<String> children = zooKeeper.getChildren("/zk-persistent", true);
            System.out.println(new String(data));
        } catch (KeeperException | InterruptedException e) {
            e.printStackTrace();
        }
        COUNT_DOWN_LATCH.countDown();
    }
}
```

#### 注册子节点监听

```java
package com.mylsaber.zookeeper;

import org.apache.zookeeper.*;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CountDownLatch;

/**
 * @author jfw
 */
public class CreateSession implements Watcher {
    private static final CountDownLatch COUNT_DOWN_LATCH = new CountDownLatch(1);
    private static ZooKeeper zooKeeper;

    public static void main(String[] args) throws IOException, InterruptedException {
        zooKeeper = new ZooKeeper("124.223.91.119:2181", 5000, new CreateSession());
        COUNT_DOWN_LATCH.await();
    }

    @Override
    public void process(WatchedEvent watchedEvent) {
        System.out.println("process执行中....");
        //⼦节点列表发⽣变化时，服务器会发出NodeChildrenChanged通知，但不会把变化情况告诉给客户端
 		// 需要客户端⾃⾏获取，且通知是⼀次性的，需反复注册监听
        if (watchedEvent.getType() == Event.EventType.NodeChildrenChanged) {
            try {
                 /*
 				path:路径
				watch:是否要启动监听，当⼦节点列表发⽣变化，会触发监听
 				zooKeeper.getChildren(path, watch);
 				*/
                final List<String> children = zooKeeper.getChildren(watchedEvent.getPath(), true);
                System.out.println(children);
            } catch (KeeperException | InterruptedException e) {
                e.printStackTrace();
            }
        }
        //当连接创建了，服务端发送给客户端SyncConnected事件
        if (watchedEvent.getState() == Event.KeeperState.SyncConnected) {
            try {
                 /**
 				* path : 获取数据的路径
 				* watch : 是否开启监听
				* stat : 节点状态信息
 				* null: 表示获取最新版本的数据
 				* zk.getData(path, watch, stat);
 				*/
                final byte[] data = zooKeeper.getData("/zk-persistent", false, null);
                final List<String> children = zooKeeper.getChildren("/zk-persistent", true);
                System.out.println(new String(data));
                System.out.println(children);
            } catch (KeeperException | InterruptedException e) {
                e.printStackTrace();
            }
        }
//        COUNT_DOWN_LATCH.countDown();
    }
}
```

#### 修改节点数据

```java
package com.mylsaber.zookeeper;

import org.apache.zookeeper.*;
import org.apache.zookeeper.data.Stat;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CountDownLatch;

/**
 * @author jfw
 */
public class CreateSession implements Watcher {
    private static final CountDownLatch COUNT_DOWN_LATCH = new CountDownLatch(1);
    private static ZooKeeper zooKeeper;

    public static void main(String[] args) throws IOException, InterruptedException {
        zooKeeper = new ZooKeeper("124.223.91.119:2181", 5000, new CreateSession());
        COUNT_DOWN_LATCH.await();
    }

    @Override
    public void process(WatchedEvent watchedEvent) {
        System.out.println("process执行中....");
        if (watchedEvent.getState() == Event.KeeperState.SyncConnected) {
            try {
                final byte[] data = zooKeeper.getData("/zk-persistent", false, null);
                System.out.println("修改前的值" + new String(data));
                /*
                path:路径
                data:要修改的内容 byte[]
                version:为-1，表示对最新版本的数据进⾏修改
                zooKeeper.setData(path, data,version);
                */
                final Stat stat = zooKeeper.setData("/zk-persistent", "zookeeper modify value".getBytes(), -1);
                System.out.println(stat.getMtime() + "-------");
                final byte[] keeperData = zooKeeper.getData("/zk-persistent", false, null);
                System.out.println(new String(keeperData));
            } catch (KeeperException | InterruptedException e) {
                e.printStackTrace();
            }
        }
        COUNT_DOWN_LATCH.countDown();
    }
}
```

#### 删除节点

```java
package com.mylsaber.zookeeper;

import org.apache.zookeeper.*;
import org.apache.zookeeper.data.Stat;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CountDownLatch;

/**
 * @author jfw
 */
public class CreateSession implements Watcher {
    private static final CountDownLatch COUNT_DOWN_LATCH = new CountDownLatch(1);
    private static ZooKeeper zooKeeper;

    public static void main(String[] args) throws IOException, InterruptedException {
        zooKeeper = new ZooKeeper("124.223.91.119:2181", 5000, new CreateSession());
        COUNT_DOWN_LATCH.await();
    }

    @Override
    public void process(WatchedEvent watchedEvent) {
        System.out.println("process执行中....");
        if (watchedEvent.getState() == Event.KeeperState.SyncConnected) {
            try {
                /*
                zooKeeper.exists(path,watch) :判断节点是否存在
                zookeeper.delete(path,version) : 删除节点
                */
                Stat exists = zooKeeper.exists("/zk-persistent/cl", false);
                System.out.println(exists == null ? "该节点不存在" : "该节点存在");
                zooKeeper.delete("/zk-persistent/cl", -1);
                exists = zooKeeper.exists("/zk-persistent/cl", false);
                System.out.println(exists == null ? "该节点不存在" : "该节点存在");
            } catch (KeeperException | InterruptedException e) {
                e.printStackTrace();
            }
        }
        COUNT_DOWN_LATCH.countDown();
    }
}
```

###  Zookeeper-开源客户端

#### ZkClient

- 创建节点

  ZkClient提供了递归创建节点的接⼝，即其帮助开发者先完成⽗节点的创建，再创建⼦节点

  ```java
  package com.mylsaber.zookeeper;
  
  import org.I0Itec.zkclient.ZkClient;
  
  /**
   * @author jfw
   */
  public class MyZkClient {
      public static void main(String[] args) {
          final ZkClient zkClient = new ZkClient("124.223.91.119:2181");
          System.out.println("完成zkClient会话创建");
          zkClient.createPersistent("/zkClient/c1",true);
          System.out.println("递归创建节点完成");
      }
  }
  ```

- 删除节点

  ZkClient提供了递归删除节点的接⼝，即其帮助开发者先删除所有⼦节点（存在），再删除⽗节点。

  ```java
  package com.mylsaber.zookeeper;
  
  import org.I0Itec.zkclient.ZkClient;
  
  /**
   * @author jfw
   */
  public class MyZkClient {
      public static void main(String[] args) {
          final ZkClient zkClient = new ZkClient("124.223.91.119:2181");
          System.out.println("完成zkClient会话创建");
          zkClient.createPersistent("/zkClient/c1/c11",true);
          // 递归删除c1下面子节点和c1
          final boolean b = zkClient.deleteRecursive("/zkClient/c1");
          System.out.println(b);
      }
  }
  ```

- 获取⼦节点，监听，修改，

  ```java
  package com.mylsaber.zookeeper;
  
  import org.I0Itec.zkclient.IZkDataListener;
  import org.I0Itec.zkclient.ZkClient;
  
  /**
   * @author jfw
   */
  public class MyZkClient {
      public static void main(String[] args) throws InterruptedException {
          final ZkClient zkClient = new ZkClient("124.223.91.119:2181");
          System.out.println("完成zkClient会话创建");
          String path = "/zkClient-ep";
          final boolean exists = zkClient.exists(path);
          if (!exists) {
              zkClient.createEphemeral(path,"临时节点");
          }
          final Object o = zkClient.readData(path);
          System.out.println(o);
          zkClient.subscribeDataChanges(path, new IZkDataListener() {
              /*
              节点内容发生变化执行的回调
              s：path
              o：变化后的内容
               */
              @Override
              public void handleDataChange(String s, Object o) {
                  System.out.println("handleDataChange");
                  System.out.println(s);
                  System.out.println(o);
              }
  
              // 节点删除后回调方法 s：path
              @Override
              public void handleDataDeleted(String s) {
                  System.out.println("handleDataDeleted");
              }
          });
          zkClient.writeData(path,"修改临时节点内容");
          Thread.sleep(1000);
          zkClient.delete(path);
          Thread.sleep(1000);
      }
  }
  ```

#### Curator客户端

curator是Netflix公司开源的⼀套Zookeeper客户端框架，和ZKClient⼀样，Curator解决了很多 Zookeeper客户端⾮常底层的细节开发⼯作，包括连接重连，反复注册Watcher和 NodeExistsException异常等，是最流⾏的Zookeeper客户端之⼀。从编码⻛格上来讲，它提供了基于 Fluent的编程⻛格⽀持

##### 添加依赖

```xml
<dependency>
  <groupId>org.apache.curator</groupId>
  <artifactId>curator-framework</artifactId>
  <version>5.2.0</version>
  <type>bundle</type>
</dependency>
```

##### 创建会话

Curator的创建会话⽅式与原⽣的API和ZkClient的创建⽅式区别很⼤。Curator创建客户端是通过 CuratorFrameworkFactory⼯⼚类来实现的。具体如下：

1. 使⽤CuratorFramework这个⼯⼚类的两个静态⽅法来创建⼀个客户端

   ```java
   public static CuratorFramework newClient(String connectString, RetryPolicy retryPolicy)
   public static CuratorFramework newClient(String connectString, int sessionTimeoutMs, int connectionTimeoutMs, RetryPolicy retryPolicy)
   ```

   其中参数RetryPolicy提供重试策略的接⼝，可以让⽤户实现⾃定义的重试策略，默认提供了以下实现， 分别为ExponentialBackoffRetry（基于backoff的重连策略）、RetryNTimes（重连N次策略）、 RetryForever（永远重试策略）

2. 通过调⽤CuratorFramework中的start()⽅法来启动会话

   ```java
   RetryPolicy retryPolicy = new ExponentialBackoffRetry(1000,3);
   CuratorFramework client = CuratorFrameworkFactory.newClient("127.0.0.1:2181",retryPolicy);
   client.start();
   ```

   ```java
   RetryPolicy retryPolicy = new ExponentialBackoffRetry(1000,3);
   CuratorFramework client = CuratorFrameworkFactory.newClient("127.0.0.1:2181",5000,1000,retryPolicy);
   client.start();
   ```

   其实进⼀步查看源代码可以得知，其实这两种⽅法内部实现⼀样，只是对外包装成不同的⽅法。它们的 底层都是通过第三个⽅法builder来实现的

   ```java
   RetryPolicy retryPolicy = new ExponentialBackoffRetry(1000,3);
   private static CuratorFramework Client = CuratorFrameworkFactory.builder()
    .connectString("server1:2181,server2:2181,server3:2181")
    .sessionTimeoutMs(50000)
    .connectionTimeoutMs(30000)
    .retryPolicy(retryPolicy)
    .build();
   client.start();
   ```

   参数：

   - connectString：zk的server地址，多个server之间使⽤英⽂逗号分隔开

   - connectionTimeoutMs：连接超时时间，如上是30s，默认是15s

   - sessionTimeoutMs：会话超时时间，如上是50s，默认是60s

   - retryPolicy：失败重试策略

     - ExponentialBackoffRetry：构造器含有三个参数 ExponentialBackoffRetry(int baseSleepTimeMs, int maxRetries, int maxSleepMs

       baseSleepTimeMs：初始的sleep时间，⽤于计算之后的每次重试的sleep时间

       maxRetries：最⼤重试次数

       maxSleepMs：最⼤sleep时间，如果上述的当前sleep计算出来⽐这个⼤，那么sleep⽤ 这个时间，默认的最⼤时间是Integer.MAX_VALUE毫秒。

     - 其他，查看org.apache.curator.RetryPolicy接⼝的实现类

   - start()：完成会话的创建

     ```java
     package com.mylsaber.zookeeper;
     
     import org.apache.curator.framework.CuratorFramework;
     import org.apache.curator.framework.CuratorFrameworkFactory;
     import org.apache.curator.retry.ExponentialBackoffRetry;
     
     /**
      * @author jfw
      */
     public class MyCurator {
         public static void main(String[] args) {
             final ExponentialBackoffRetry backoffRetry = new ExponentialBackoffRetry(1000, 3);
             final CuratorFramework client = CuratorFrameworkFactory.builder()
                     .connectString("124.223.91.119:2181")
                     .sessionTimeoutMs(5000)
                     .connectionTimeoutMs(3000)
                     .retryPolicy(backoffRetry)
                     .namespace("base")
                     .build();
             client.start();
         }
     }
     ```

##### 创建节点

curator提供了⼀系列Fluent⻛格的接⼝，通过使⽤Fluent编程⻛格的接⼝，开发⼈员可以进⾏⾃由组合 来完成各种类型节点的创建。

- 创建⼀个初始内容为空的节点，Curator默认创建的是持久节点，内容为空。

  ```java
  client.create().forPath(path);
  ```

- 创建⼀个包含内容的节点

  ```java
  client.create().forPath(path,"我是内容".getBytes());
  ```

- 递归创建⽗节点,并选择节点类型

  ```java
  client.create().creatingParentsIfNeeded().withMode(CreateMode.EPHEMERAL).forPath(path);
  ```

##### 删除节点

- 删除⼀个⼦节点

  ```java
  client.delete().forPath(path);
  ```

- 删除节点并递归删除其⼦节点

  ```java
  client.delete().deletingChildrenIfNeeded().forPath(path);
  ```

- 指定版本进⾏删除

  ```java
  client.delete().withVersion(1).forPath(path);
  ```

  如果此版本已经不存在，则删除异常，异常信息org.apache.zookeeper.KeeperException$BadVersionException

- 强制保证删除⼀个节点

  ```java
  client.delete().guaranteed().forPath(path);
  ```

  只要客户端会话有效，那么Curator会在后台持续进⾏删除操作，直到节点删除成功。⽐如遇到⼀些⽹ 络异常的情况，此guaranteed的强制删除就会很有效果。

##### 获取数据

获取节点数据内容API相当简单，同时Curator提供了传⼊⼀个Stat变量的⽅式来存储服务器端返回的最 新的节点状态信息

```java
// 普通查询
client.getData().forPath(path);
// 包含状态查询
Stat stat = new Stat();
client.getData().storingStatIn(stat).forPath(path);
```

##### 更新数据

更新数据，如果未传⼊version参数，那么更新当前最新版本，如果传⼊version则更新指定version，如 果version已经变更，则抛出异常

```java
// 普通更新
client.setData().forPath(path,"新内容".getBytes());
// 指定版本更新
client.setData().withVersion(1).forPath(path);
```

## Zookeeper应⽤场景

ZooKeeper是⼀个典型的发布/订阅模式的分布式数据管理与协调框架，我们可以使⽤它来进⾏分布式 数据的发布与订阅。另⼀⽅⾯，通过对ZooKeeper中丰富的数据节点类型进⾏交叉使⽤，配合Watcher 事件通知机制，可以⾮常⽅便地构建⼀系列分布式应⽤中都会涉及的核⼼功能，如数据发布/订阅、命名 服务、集群管理、Master选举、分布式锁和分布式队列等。那接下来就针对这些典型的分布式应⽤场景 来做下介绍