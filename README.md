卷积神经网络演示系统
=======================

这是一个关于卷积神经网络的演示系统


项目依赖
---------------
此项目依赖flask、Pillow、numpy和TensorFlow

```bash
$ pip install flask Pillow numpy tensorflow
```

如果有可用的GPU，可以安装GPU版本的TensorFlow

```bash
$ pip install  tensorflow-gpu
```

### 项目初始化

初始化阶段生成配置文件并且使用模型产生训练动画的数据

```bash
$ ./initialize.py
$ ./newModel.py --Train
```

### 启动项目

```bash
$ ./app.py
```