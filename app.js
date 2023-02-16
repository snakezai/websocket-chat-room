var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const users = [];

//public目录设为静态资源目录
app.use(require('express').static('public'))

server.listen(3000, () => {
  console.log('服务器启动')
});

app.get('/', function (req, res) {
  res.redirect('/index.html')
});
//登录
io.on('connection', function (socket) {
  // 登录
  socket.on('login', data => {
    // console.log(data)
    let user = users.find(item => item.username === data.username);
    if(user){
      socket.emit('loginError',{message:'登陆失败'})
    }else {
      users.push(data)
      socket.emit('loginSucess',data)
      
      //io.emit广播事件
      io.emit('addUser',data)

      //用户列表
      io.emit('userList',users)

      //存储用户头像和名字
      socket.username = data.username
      socket.avatar = data.avatar
    }
  })
  //退出登录
  socket.on('disconnect',() => {
    //删除当前用户信息
    let idx = users.findIndex(item => item.username === socket.username)
    //delete
    users.splice(idx,1)
  
    io.emit('delUser',{
      username: socket.username,
      avatar: socket.avatar
    })
    io.emit('userList',users)
  })
  //监听聊天
  socket.on('sendMessage',data => {
    console.log(data)
    // 广播所有人
    io.emit('receiveMessage',data)
  })

});