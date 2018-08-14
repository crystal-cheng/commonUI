

$('#deployConfig').on('change',function(){
    var  file = $('#deployConfig')[0].files[0];
    var formData = new FormData();
    formData.append('config', file);
    console.log(file,formData,'formData');
    $.ajax({
        url: '/importExcel/config',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (msg) {
           console.log(msg,'suc');

        },
        error: function (msg) {
            console.log(msg,'error');
        }
    });
    // console.log(ff,'212');
    // var reader=new FileReader();
    // reader.readAsDataURL(ff);
    // reader.onloadstart=function () {
    //     console.log('文件上传处理......')
    // };
    //操作完成
    // reader.onload = function(e){
    //     //file 对象的属性
    //     // $('.img').attr('src',reader.result);
    //     console.log(reader,'reader');
    // };
});