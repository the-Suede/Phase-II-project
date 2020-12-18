$('form').submit(function(event){
    event.preventDefault()//阻止默认事件
    let username = $("#username").val()
    let password = $("#password").val()
    $.ajax({
        url:'../api/login.php',
        data:{
            username:username,
            password:password
        },
        type:'post',
        async: true,
        success: function (res) {
            res = JSON.parse(res)
            // console.log(res);
            
            if(res.code==1){
                setCookie('login',username)//setCookie
                // console.log(1);
                
                let url = localStorage.getItem('url');//如果成功，从哪里来，回哪里
                if(url){
                    location.href = url;
                    // 登录成功的时候把url的这个cookie值清除
                    localStorage.removeItem('url');
                }else{
                    location.href = '../html/list.html';
                }     
            }else{
                alert("用户名或密码错误")
                $("#username").val('')
                $("#password").val('')
            }
            
        }
    })
})