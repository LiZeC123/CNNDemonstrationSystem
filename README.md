卷积神经网络演示系统
=======================

这是一个关于卷积神经网络的演示系统


参考资料
----------

### TensorFlow相关
- [关于加载数据集的分析](https://www.jianshu.com/p/817ea446b9b9)
- [关于梯度下降的一些分析](https://blog.csdn.net/xierhacker/article/details/53174558)
- [关于正则化](https://blog.csdn.net/u012560212/article/details/73000740)
- [保存和恢复模型](https://blog.csdn.net/huachao1001/article/details/78501928)

### Flask

#### Request 对象

通过Request的以下成员变量获得请求参数

参数    | 含义
--------|-------------------------
args    | 查询字符串
data    | 字符串形式的请求数据
files   | 上传的文件
form    | 表单数据
values  | args和form的数据
json    | 解析后的JSON数据


### curl 操作
```shell
curl http://127.0.0.1:5000/hello -d 'name=baseimage&data=dsa4309jdsl'
```

### 其他参考资料
- [HTML5 -- canvas画板转为图片](https://blog.csdn.net/sinat_19327991/article/details/77050717 )
- [HTML5 Canvas画图、保存图片、提交文件问题](https://www.jianshu.com/p/df7461ff64b1)