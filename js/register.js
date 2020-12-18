//点击回退到列表页
$('.return').click(function(){
    location.href = './list.html'
})
//点击‘同意按钮’，注册框滑入
$('.message_btn').click(function(){
    $('#app').css('display','none')
    $('.message_btn').css('display','none')
    $('.register').css('display','block').finish().animate({bottom:0},500,'linear')
    $('.cancel').click(function(){
        $(".register").animate({bottom:-705},500,'linear').css('display','none')
        $("#app").css('display','block')
        $('.message_btn').css('display','block')
    })
})
//验证码
let verifyCode = new GVerify({
    id: "picyzm",
    length: 4
});
// jq注册正则
$('#registerForm').validate({
    rules:{
        username:{
            required:true,
            maxlength:12,
            minlength:6,
            remote:{
                type:'post',
                url:'../api/registerYZ.php',
                dataType:'json',
                data:{
                    username:function(){
                        return $("#username").val()
                    }
                },
                //验证用户名是否存在
                dataFilter:function(data){
                        data = JSON.parse(data)
                        data = data.data
                        console.log(data);
                        if(data == true){
                            return true;
                        }
                        else{
                            return false;
                        }    
                }
            }
        },
        password:'required',
        passwordFinal:{
            required:true,
            equalTo: "#password"
        },
        code:{
            required:true,
        }
    },
    messages:{
        username:{
            required: '请输入用户名',
            maxlength: '用户的最大长度只能为12位',
            minlength: '用户名不能低于6位字符',
            remote:'用户名已存在'
        },
        password:{
            required: '请输入密码'
        },
        passwordFinal:{
            required: '请确认密码',
            equalTo: "密码输入不一致"
        },
        code:{
            required: '请输入验证码',
        }
    },
    submitHandler:function(){
        let res = verifyCode.validate($('#code_input').val());
            if (!res) {
                alert("验证码错误");
            } else {
                $.ajax({
                    url:'../api/register.php',
                    type:'post',
                    data:{
                        username:$("#username").val(),
                        password:$("#password").val()
                    },
                    async: true,
                    success: function (res) {
                        res = JSON.parse(res)
                        if(res.code==true){
                            location.href = '../html/list.html'
                        }else{
                            alert("注册失败")
                        }
                    }
                })
            }
    }
})

