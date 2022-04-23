## bug记录

`com.alibaba.nacos.api.exception.NacosException: Request nacos server failed`

Nacos2.0版本相比1.X新增了gRPC的通信方式，因此需要增加2个端口。新增端口是在配置的主端口(server.port)基础上，进行一定偏移量自动生成。Nacos2.0增加了9848，9849端口来进行GRPC通信

如果docker启动，添加端口映射 `-p 8848:8848 9848:9848`