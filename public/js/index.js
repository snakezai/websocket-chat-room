//聊天室的功能
var socket = io('http://localhost:3000')
var user_name,user_avatar

//登录
$('#login_avatar li img').on('click', function(){
    $(this).addClass('now').siblings().removeClass('now')
})

$('#login_button').on('click',function(){
    var username = $('#username').val().trim()
    if(!username){
        alert('名♂字都没填还想进来♂');
        return;
    }
    var avatar = $('#login_avatar li img.now').attr('src')
    console.log(username,avatar)

    socket.emit('login',{
        username: username,
        avatar: avatar
    })
    socket.on('loginError', data => {
        alert('登录失败,名字重复');
    })
    socket.on('loginSucess', data => {
        // alert('登录成功');
        //隐藏登录窗口，显示聊天窗口
        $('.login').fadeOut()
        $('.chat').fadeIn()
        // console.log(data)
        $('.b').attr('src', data.avatar)
        $('.name').text(data.username)

        //浏览器记录用户信息
        user_name = data.username
        user_avatar = data.avatar
    })
    // 监听聊天消息
    socket.on('recieve',data => {
        console.log(data)
    })
})
//用户加入系统消息
socket.on('addUser',data => {
    $('#content').append(`
    <div>
        <p class="system">欢迎${data.username}酱加♂入了我们</p>
    </div>
    `)
    scrollIntoView()
})
//更新用户列表
socket.on('userList',data => {
    // console.log(data)
    $('.list_ul').html('')
    data.forEach(item => {
        $('.list_ul').append(`
        <li class='list_li'>
              <img src='${item.avatar}' alt='' class='b'/>
              <span class='name'>${item.username}</span>
          </li>
    `)
    })
    // 聊天框头人数
    $('#userCount').text(data.length)
})
// 用户离开系统消息
socket.on('delUser',data => {
    $('#content').append(`
    <div>
        <p class="system">${data.username}酱润了</p>
    </div>    
    `)
    scrollIntoView()
})

//聊天内容
$('.send_button').on('click',() => {
    var msg = $('.msg').val()
    if(!msg) return alert('别害羞，输点东西进去')
    socket.emit('sendMessage', {
        msg: msg,
        username: user_name,
        avatar: user_avatar
    })
})
// 监听聊天消息
socket.on('receiveMessage',data => {
    // console.log(data)
    if(data.username === user_name){
        $('#content').append(`
            <div class="my">
                <img src="${data.avatar}" alt="" class="myavatar" />
                <span class="word">
                    <div class="myname">
                        <div>${data.username}</div>
                        <div class="myword">${data.msg}</div>
                    </div>
                </span>
            </div>
        `)
    } else {
        $('#content').append(`
            <div class="other">
                <img src="${data.avatar}" alt="" class="otheravatar" />
                <span class="word">
                    <div class="othername">
                        <div>${data.username}</div>
                        <div class="otherword">${data.msg}</div>
                    </div>
                </span>
            </div>
        `)
    }
    // 当前元素底部滚动到可视区
    scrollIntoView()
})
//新消息跳转函数
function scrollIntoView(){
    $('#content').children(':last').get(0).scrollIntoView(false)
}