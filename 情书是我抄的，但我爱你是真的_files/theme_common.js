

var audio_music=document.getElementById('audio_music'); 
var audio_record=document.getElementById('audio_record'); 

if(bool_empty(json_music,'music_select')==false){
    if(json_music['music_select']=='m_online' && bool_empty(json_music,'m_online_url')==false){ //选择在线列表
        $('#audio_music').attr('src','https://other-web-ri01-sycdn.kuwo.cn/af0c95ee45cccb50bf236794b679d2a7/6468d336/resource/n3/52/87/2500649018.mp3');
    }
    if(json_music['music_select']=='m_upload' && bool_empty(json_music,'m_upload_url')==false){ //选择上传歌曲并且成功上传歌曲
        $('#audio_music').attr('src','https://other-web-ri01-sycdn.kuwo.cn/af0c95ee45cccb50bf236794b679d2a7/6468d336/resource/n3/52/87/2500649018.mp3');
    }
    if(json_music['music_select']=='m_record' && bool_empty(json_music,'m_record_url')==false){ //选择录音并且成功录音
        $('#audio_music').attr('src','https://other-web-ri01-sycdn.kuwo.cn/af0c95ee45cccb50bf236794b679d2a7/6468d336/resource/n3/52/87/2500649018.mp3');
    }
    if(json_music['music_select']=='m_online' && bool_empty(json_music,'m_online_url')==true){ //选择在线列表但是没有选择歌曲
        console.log('选择在线列表，但是没有选择歌曲');
        var random_music=random_music_as();
        $('#audio_music').attr('src',random_music);
    }
    if(json_music['music_select']=='m_upload' && bool_empty(json_music,'m_upload_url')==true){ //选择上传歌曲但是没有上传歌曲
        console.log('选择上传歌曲，但是没有成功上传歌曲');
        var random_music=random_music_as();
        $('#audio_music').attr('src',random_music);
    }
    if(json_music['music_select']=='m_record' && bool_empty(json_music,'m_record_url')==true){ //选择录音但是没有成功录音
        console.log('选择录音，但是没有成功录音');
        var random_music=random_music_as();
        $('#audio_music').attr('src',random_music);
    }
    if(theme!='audio_list' || (theme=='audio_list' && start!='null')){
        audio_music.play(); //触发音乐自动播放
    }else{
        audio_music.pause();
        console.log('audio_list && no start');
    }
}else{ //全新作品或空作品
    console.log('set random music');
    var random_music=random_music_as();
    $('#audio_music').attr('src',random_music);
    if(theme!='audio_list' || (theme=='audio_list' && start!='null')){
        audio_music.play(); //触发音乐自动播放
    }else{
        audio_music.pause();
        console.log('audio_list && no start');
    }
}



if(bool_empty(json_record,'record_bool')==false){
    if(json_record['record_bool']=='r_true' && bool_empty(json_record,'r_wechat_url')==false){ //选择要语音并且成功录制语音
        $('#audio_record').attr('src',json_record['r_wechat_url']);
    }
    if(json_record['record_bool']=='r_true' && bool_empty(json_record,'r_wechat_url')==true){ //选择要语音，但没有成功录制
        console.log('选择要语音，但没有成功录制');
        $('#audio_record').attr('src','http://public.jiatuma.com/chongqin_shenlin.mp3');
    }
    if(json_record['record_bool']=='r_false'){ //如果不要语音则不显示
        $('#div_record').hide();
        $('#div_record_tips').hide();
    }
}else{
    //未定义语音
    $('#div_record').hide();
    $('#div_record_tips').hide();
}



function random_music_as(){  //获取随机的模板图片
    var random_num=Math.floor(Math.random()*(arr_as_music.length)); //随机取值 
    var random_music=arr_as_music[random_num];
    return random_music;
}



//控制音乐切换播放暂停 
var div_music=document.getElementById('div_music');
var timeout_music_tips;
function music_switch(){ //切换   
    clearTimeout(timeout_music_tips);  
    if(audio_music.paused){
        console.log('switch music to play');
        audio_music.play();
        audio_record.pause(); //播放音乐时录音一定暂停
        div_music.style.webkitAnimation='rotate_round 1s linear infinite';
        $('.div_music_tips').html('正播放').show();                
        timeout_music_tips=setTimeout(function(){$('.div_music_tips').hide()}, 2500);
    }else{
        console.log('switch music to paused'); 
        audio_music.pause();
        div_music.style.webkitAnimation='';
        $('.div_music_tips').html('已暂停').show();
        timeout_music_tips=setTimeout(function(){$('.div_music_tips').hide()}, 2500); 
    } 
}



var timeout_record_tips;
var div_record=document.getElementById('div_record');
function record_switch(){ //切换 
    clearTimeout(timeout_record_tips);
    if(audio_record.paused){
        console.log('switch record to play'); 
        audio_record.play();
        audio_music.pause(); 
        div_record.style.webkitAnimation='rotate_round 1s linear infinite';
        div_music.style.webkitAnimation='';
        $('.div_record_tips').html('正播放').show(); 
        timeout_record_tips=setTimeout(function(){$('.div_record_tips').hide()}, 2500);
    }else{
        console.log('switch record to pause');  
        audio_record.pause(); 
        audio_music.play(); 
        div_record.style.webkitAnimation='rotate_vibrate 1s linear infinite';
        div_music.style.webkitAnimation='rotate_round 1s linear infinite';
        $('.div_record_tips').html('已暂停').show();  
        timeout_record_tips=setTimeout(function(){$('.div_record_tips').hide()}, 2500); 
    } 
}






//以下是微信相关的设置
if(typeof(signPackage)!='undefined'){
    console.log(signPackage);
    init_wx_conf();
}
function init_wx_conf(){
    wx.config({
        debug: false,
        appId: signPackage['appid'],
        timestamp: signPackage['timestamp'],
        nonceStr: signPackage['nonceStr'],
        signature: signPackage['signature'],
        jsApiList: [
            'checkJsApi',
            'updateAppMessageShareData',
            'updateTimelineShareData'
        ]
    });

    wx.ready(function(){
        console.log('wx.ready success to start');
        if(theme!='audio_list' || (theme=='audio_list' && start!='null')){
            audio_music.play(); //触发音乐自动播放
        }else{
            audio_music.pause(); //触发音乐自动播放
            console.log('audio_list && no start');
        } 
        
        wx.updateAppMessageShareData({ 
            title: wx_share_data['title'], // 分享标题
            desc: wx_share_data['desc'], // 分享描述
            link: wx_share_data['link'], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: wx_share_data['imgUrl'], // 分享图标
            success: function () {
                console.log('wx.updateAppMessageShareData 设置成功');
            }
        });
        wx.updateTimelineShareData({ 
            title: wx_share_data['title'], // 分享标题
            link: wx_share_data['link'], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: wx_share_data['imgUrl'], // 分享图标
            success: function () {
                console.log('wx.updateTimelineShareData 设置成功');
            }
        })
    });

    wx.error(function(res){
        console.log(res);
        if(theme!='audio_list' || (theme=='audio_list' && start!='null')){
            audio_music.play(); //触发音乐自动播放
        }else{
            audio_music.pause(); //触发音乐自动播放
            console.log('audio_list && no start');
        }
    });
}







