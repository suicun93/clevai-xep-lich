/// Thu vien

// Xu ly file
const fs = require('fs');
const path = require('path');
const multer = require('multer');
// Server
const express = require('express');
const cors = require('cors');
// Zip
var archiver = require('archiver');
// Mail
var nodemailer = require('nodemailer');

// Call API
var FormData = require('form-data');
const axios = require('axios');
// Port
const port = process.env.PORT || 80;

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "uploads"))
    },
    filename: function(req, file, cb) {
        // Define logic để lưu file chỗ này
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

const app = express();
app.use(cors());

app.listen(port, () => {
    console.log("server is start on port " + port)
});
app.use('/clevaiFont.ttf', express.static(__dirname + '/fonts/clevaiFont.ttf'));
app.use('/clevaiFont-normal.ttf', express.static(__dirname + '/fonts/clevaiFont-normal.ttf'));
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get("/xep-lich", function(req, res) {
    res.sendFile(path.join(__dirname + '/xep-lich.html'));
});
app.get("/chia-slide", function(req, res) {
    res.sendFile(path.join(__dirname + '/chia-slide.html'));
});
app.get("/xep-lich-test-prep9", function(req, res) {
    res.sendFile(path.join(__dirname + '/xep-lich-test-prep9.html'));
});
app.get("/chia-slide-test-prep9", function(req, res) {
    res.sendFile(path.join(__dirname + '/chia-slide-test-prep9.html'));
});
app.get('/download', function(req, res) {
    res.download(
        __dirname + '/' + req.query.tenFile,
        req.query.tenFile,
        (err) => {
            if (err) {
                console.log(err);
            }
            try {
                fs.unlink(__dirname + '/' + req.query.tenFile, (er) => {
                    if (er) {
                        console.log(er);
                    }
                    console.log("done " + req.query.tenFile);
                });
            } catch (error) {
                console.log(error);
            }
        });

});
app.post("/sapXep", upload.fields([
    // Trong form có field nào thì define chỗ này
    { name: 'powerpointA1', maxCount: 1 },
    { name: 'powerpointA2', maxCount: 1 },
    { name: 'powerpointB1', maxCount: 1 },
    { name: 'powerpointB2', maxCount: 1 },
    { name: 'powerpointC1', maxCount: 1 },
    { name: 'powerpointC2', maxCount: 1 },

    { name: 'ngay', maxCount: 1 },
    { name: 'khoi', maxCount: 1 },
    { name: 'A0', maxCount: 1 },
    { name: 'A1', maxCount: 1 },
    { name: 'A2', maxCount: 1 },
    { name: 'A3', maxCount: 1 },
    { name: 'A4', maxCount: 1 },
    { name: 'A5', maxCount: 1 },
    { name: 'A6', maxCount: 1 },
    { name: 'A7', maxCount: 1 },
    { name: 'A8', maxCount: 1 },
    { name: 'A9', maxCount: 1 },
    { name: 'B0', maxCount: 1 },
    { name: 'B1', maxCount: 1 },
    { name: 'B2', maxCount: 1 },
    { name: 'B3', maxCount: 1 },
    { name: 'B4', maxCount: 1 },
    { name: 'B5', maxCount: 1 },
    { name: 'B6', maxCount: 1 },
    { name: 'B7', maxCount: 1 },
    { name: 'B8', maxCount: 1 },
    { name: 'B9', maxCount: 1 },
    { name: 'C0', maxCount: 1 },
    { name: 'C1', maxCount: 1 },
    { name: 'C2', maxCount: 1 },
    { name: 'C3', maxCount: 1 },
    { name: 'C4', maxCount: 1 },
    { name: 'C5', maxCount: 1 },
    { name: 'C6', maxCount: 1 },
    { name: 'C7', maxCount: 1 },
    { name: 'C8', maxCount: 1 },
    { name: 'C9', maxCount: 1 },
]), async(req, res) => {
    console.log(req.body);
    console.log(req.files);
    var ngay = req.body.ngay;
    var day = new Date(ngay);
    var chuNhat = getDay('9', day);
    var tenFile = 'DaXepLich_' + day.getDate() + '.' + (day.getMonth() + 1);
    var khoi = 'Lop' + req.body.khoi;
    var dong5 = {};
    dong5.sheetName = khoi;
    var dong4 = {};
    dong4.x = 'C';
    dong4.sheetName = khoi;
    var dong3 = {};
    dong3.x = 'B';
    dong3.sheetName = khoi;
    var dong2 = {};
    dong2.x = 'A';
    dong2.sheetName = khoi;
    var dong1 = {};
    dong1.x = 'Tuần (' + day.getDate() + '/' + (day.getMonth() + 1) + ' - ' + chuNhat.ngay + '/' + chuNhat.thang + ')';
    dong1.sheetName = khoi;
    dong1['0'] = thuNgayThang(day, '0');
    dong1['1'] = thuNgayThang(day, '1');
    dong1['2'] = thuNgayThang(day, '2');
    dong1['3'] = thuNgayThang(day, '3');
    dong1['4'] = thuNgayThang(day, '4');
    dong1['5'] = thuNgayThang(day, '5');
    dong1['6'] = thuNgayThang(day, '6');
    dong1['7'] = thuNgayThang(day, '7');
    dong1['8'] = thuNgayThang(day, '8');
    dong1['9'] = thuNgayThang(day, '9');
    // Xu ly
    for (var soThuTu in [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]) {
        let keyA = 'A' + soThuTu;
        let keyB = 'B' + soThuTu;
        let keyC = 'C' + soThuTu;
        var soThuTuFile = laBuoiThuNhat(soThuTu) ? '1' : '2';
        var functionA = new Promise(async(done, close) => {
            try {
                var result = await copyFile(req.files['powerpointA' + soThuTuFile][0], req.body[keyA], soThuTu, tenFile, day);
                done(result);
            } catch (error) {
                done("");
                console.error('copyFile error: ' + error);
            }
        });
        var functionB = new Promise(async(done, close) => {
            try {
                var result = await copyFile(req.files['powerpointB' + soThuTuFile][0], req.body[keyB], soThuTu, tenFile, day);
                done(result);
            } catch (error) {
                done("");
                console.error('copyFile error: ' + error);
            }
        });
        var functionC = new Promise(async(done, close) => {
            try {
                var result = await copyFile(req.files['powerpointC' + soThuTuFile][0], req.body[keyC], soThuTu, tenFile, day);
                done(result);
            } catch (error) {
                done("");
                console.error('copyFile error: ' + error);
            }
        });
        [dong2[soThuTu], dong3[soThuTu], dong4[soThuTu]] = await Promise.all([functionA, functionB, functionC]);
    }

    // Don dep
    var arrPromise = [
        'powerpointA1',
        'powerpointA2',
        'powerpointB1',
        'powerpointB2',
        'powerpointC1',
        'powerpointC2'
    ].map(file => new Promise(async(ok) => {
        try {
            if (req.files[file]) { await fs.unlinkSync('uploads/' + req.files[file][0].originalname); }
        } catch (error) {
            // ko quan taam
        }
        ok();
    }));
    await Promise.all(arrPromise);

    /// Nen lai
    var output = fs.createWriteStream(tenFile + '.zip');
    var archive = archiver('zip');
    output.on('close', function() {
        deleteFolderRecursive(tenFile);
    });
    archive.on('error', function(err) {
        throw err;
    });
    archive.pipe(output);
    archive.directory(tenFile, false);
    await archive.finalize();

    // // Report lên API
    // var reportCach1 = async() => {
    //     await report(dong5);
    //     await report(dong4);
    //     await report(dong3);
    //     await report(dong2);
    //     await report(dong1);
    //     console.log('report 1 done');
    // };
    // reportCach1();

    // Report kieu cua Hoai
    var report2Data = {};
    var report2Data2 = {};
    report2Data.sheetName = 'Tháng ' + getDay('0', day).thang + '/' + getDay('0', day).nam;
    report2Data2.sheetName = 'Tháng ' + getDay('9', day).thang + '/' + getDay('9', day).nam;
    report2Data.data = [];
    report2Data2.data = [];
    for (var soThuTu in [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]) {
        let keyA = 'A' + soThuTu;
        let keyB = 'B' + soThuTu;
        let keyC = 'C' + soThuTu;
        var dataA = {};
        var dataB = {};
        var dataC = {};
        let ngayDangXet = getDay(soThuTu, day);
        dataA.ngay = ngayDangXet.ngay + '/' + ngayDangXet.thang + '/' + ngayDangXet.nam;
        dataB.ngay = ngayDangXet.ngay + '/' + ngayDangXet.thang + '/' + ngayDangXet.nam;
        dataC.ngay = ngayDangXet.ngay + '/' + ngayDangXet.thang + '/' + ngayDangXet.nam;
        dataA.giao_vien = req.body[keyA];
        dataB.giao_vien = req.body[keyB];
        dataC.giao_vien = req.body[keyC];
        dataA.khoi = khoi;
        dataB.khoi = khoi;
        dataC.khoi = khoi;
        dataA.trinh_do = 'A';
        dataB.trinh_do = 'B';
        dataC.trinh_do = 'C';
        dataA.ten_file = dong2[soThuTu];
        dataB.ten_file = dong3[soThuTu];
        dataC.ten_file = dong4[soThuTu];
        if (getDay('0', day).thang == getDay(soThuTu, day).thang) {
            report2Data.data.push(dataA);
            report2Data.data.push(dataB);
            report2Data.data.push(dataC);
        } else {
            report2Data2.data.push(dataA);
            report2Data2.data.push(dataB);
            report2Data2.data.push(dataC);
        }
    }
    report2(report2Data);
    if (report2Data2.data) {
        report2(report2Data2);
    }
    // Send file
    res.status(200).send({ "tenFile": tenFile + '.zip' });
});

// Xep lich của chị Hương
app.post("/xep-lich", upload.fields([
    { name: 'listGiaoVien', maxCount: 1 },
    { name: 'ngay', maxCount: 1 },
    { name: 'khoi', maxCount: 1 },
    { name: 'A0', maxCount: 1 },
    { name: 'A1', maxCount: 1 },
    { name: 'A2', maxCount: 1 },
    { name: 'A3', maxCount: 1 },
    { name: 'A4', maxCount: 1 },
    { name: 'A5', maxCount: 1 },
    { name: 'A6', maxCount: 1 },
    { name: 'A7', maxCount: 1 },
    { name: 'A8', maxCount: 1 },
    { name: 'A9', maxCount: 1 },
    { name: 'B0', maxCount: 1 },
    { name: 'B1', maxCount: 1 },
    { name: 'B2', maxCount: 1 },
    { name: 'B3', maxCount: 1 },
    { name: 'B4', maxCount: 1 },
    { name: 'B5', maxCount: 1 },
    { name: 'B6', maxCount: 1 },
    { name: 'B7', maxCount: 1 },
    { name: 'B8', maxCount: 1 },
    { name: 'B9', maxCount: 1 },
    { name: 'C0', maxCount: 1 },
    { name: 'C1', maxCount: 1 },
    { name: 'C2', maxCount: 1 },
    { name: 'C3', maxCount: 1 },
    { name: 'C4', maxCount: 1 },
    { name: 'C5', maxCount: 1 },
    { name: 'C6', maxCount: 1 },
    { name: 'C7', maxCount: 1 },
    { name: 'C8', maxCount: 1 },
    { name: 'C9', maxCount: 1 },
]), async(req, res) => {
    console.log(req.body);
    console.log(req.files);
    var ngay = req.body.ngay;
    var khoi = req.body.khoi;
    var day = new Date(ngay);

    // Check xem lịch cũ có chưa
    let sheetName = `${khoi}_${day.getDate()}.${day.getMonth()+1}.${day.getYear()+1900}`;
    // var lichCu;
    // try {
    //     var ahihi = await axios.get(
    //         'https://script.google.com/macros/s/AKfycbytw2lBLbHgC3Mdu0zn8CmUSSd6_3A7xtxIjGXs2yKQgkjFLz99cirmrJkZ4dNG9ZO8/exec?sheetName=' + sheetName, {
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //             },
    //         },
    //     );
    //     lichCu = ahihi.data;
    // } catch (er) {
    //     console.error(er);
    // }

    // if (lichCu && lichCu.result == 'success') {
    // var lichHoc = '';
    // for (var soThuTu in [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]) {
    //     let keyA = 'A' + soThuTu;
    //     let keyB = 'B' + soThuTu;
    //     let keyC = 'C' + soThuTu;
    //     if (lichCu.data[keyA] != req.body[keyA]) {
    //         lichHoc +=
    //             'Đã chuyển khối ' + sheetName +
    //             ' lớp [' + 'A' + '] buổi [' + thuNgayThang(day, soThuTu) +
    //             '] từ [' + lichCu.data[keyA] + '] sang [' + req.body[keyA] + ']\n';
    //     }
    //     if (lichCu.data[keyB] != req.body[keyB]) {
    //         lichHoc +=
    //             'Đã chuyển khối ' + sheetName +
    //             ' lớp [' + 'B' + '] buổi [' + thuNgayThang(day, soThuTu) +
    //             '] từ [' + lichCu.data[keyB] + '] sang [' + req.body[keyB] + ']\n';
    //     }
    //     if (lichCu.data[keyC] != req.body[keyC]) {
    //         lichHoc +=
    //             'Đã chuyển khối ' + sheetName +
    //             ' lớp [' + 'C' + '] buổi [' + thuNgayThang(day, soThuTu) +
    //             '] từ [' + lichCu.data[keyC] + '] sang [' + req.body[keyC] + ']\n';
    //     }
    // }

    // // Gửi mail:
    // if (lichHoc) {
    //     var transporter = nodemailer.createTransport({
    //         service: 'gmail',
    //         auth: {
    //             user: 'clevai.xep.lich@gmail.com',
    //             pass: 'Hoai1234@@'
    //         }
    //     });
    //     var mailOptions2 = {
    //         from: 'clevai.xep.lich@gmail.com',
    //         to: 'duchoang191@gmail.com',
    //         subject: '[' + sheetName + '] Yêu cầu thay đổi slide do chuyển lịch học ' + sheetName,
    //         text: lichHoc,
    //     };
    //     transporter.sendMail(mailOptions2, function(error, info) {
    //         if (error) {
    //             console.log('Email sent failed: ' + error);
    //         } else {
    //             console.log('Email sent: ' + info.response);
    //         }
    //     });
    // }
    // }
    // Gửi mail:
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'clevai.xep.lich@gmail.com',
            pass: 'Hoai1234@@'
        }
    });
    var mailOptions2 = {
        from: 'clevai.xep.lich@gmail.com',
        to: 'duchoang191@gmail.com',
        subject: '[' + sheetName + '] Yêu cầu thay đổi slide do chuyển lịch học ' + sheetName,
        text: JSON.stringify(req.body),
    };
    transporter.sendMail(mailOptions2, function(error, info) {
        if (error) {
            console.log('Email sent failed: ' + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


    // Ghi lại
    try {
        req.body['sheetName'] = sheetName;
        let sendData = getFormData(req.body);
        let result = await axios.post(
            'https://script.google.com/macros/s/AKfycbytw2lBLbHgC3Mdu0zn8CmUSSd6_3A7xtxIjGXs2yKQgkjFLz99cirmrJkZ4dNG9ZO8/exec',
            sendData, {
                headers: sendData.getHeaders(),
            },
        );
        if (result.data && result.data.result == 'success') {
            res.status(200).send({ "message": 'success' });
        } else {
            console.log('Xep lich fail: ' + JSON.stringify(result));
            res.status(200).send({ "message": 'failed' });
        }
    } catch (error) {
        console.log('Xep lich fail: ' + JSON.stringify(error));
        res.status(200).send({ "message": 'failed ' + error });
    }

    return;
});

// async function report(data) {
//     try {
//         let sendData = getFormData(data);
//         let result = await axios.post(
//             'https://script.google.com/macros/s/AKfycbzjdX9TtcXXP6E7tkN2momjNIKSCrHMEzU_0BPz4c0LorUU8fqTIM6uv4pSvgntQt9bfQ/exec',
//             sendData, {
//                 headers: sendData.getHeaders()
//             }
//         );
//         if (result.data && result.data.result == 'success') {
//             console.log('Report 1 Done');
//         } else {
//             console.log('Report 1 Failed');
//         }
//     } catch (error) {
//         console.log('report 1 failed: ' + error);
//     }
// }
async function report2(data) {
    try {
        let sendData = getFormData({
            'sheetName': data['sheetName'],
            'data': JSON.stringify(data['data']),
        });
        let result = await axios.post(
            'https://script.google.com/macros/s/AKfycbwLJJEguoOEUe09q3PlQh2jjvrMo7AAlSj7TqQNZyh9SZA7PaJFGPo3usKtCAz7q1JfQA/exec',
            sendData, {
                headers: sendData.getHeaders(),
            },
        );
        if (result.data && result.data.result == 'success') {
            console.log('Report 2 Done');
        } else {
            console.log('Report 2 Failed');
        }
    } catch (error) {
        console.log('report 2 failed: ' + error);
    }
}

async function copyFile(file, field, soThuTu, path, ngay) {
    // Với Xo -> Ném file files[powerpointX(soThuTuFile(o))] 
    // vào thư mục fields[Xo]
    // Và đổi tên file thành Blabla_fields[Xo].pptx
    var dir = path + '/' + field;
    var day = getDay(soThuTu, ngay);
    var newName =
        day.ngay + '.' + day.thang +
        '(' + day.buoi + ')_' +
        field + '_' +
        file.originalname;
    try {
        if (file && field) {
            if (!fs.existsSync(dir)) {
                await fs.mkdirSync(dir, {
                    recursive: true
                });
            }
            await fs.copyFileSync(
                'uploads/' + file.originalname,
                dir + '/' + newName,
            );
            return newName;
        } else {
            return "";
        }
    } catch (error) {
        return error + ' ' + newName;
    }
}

function getDay(soThuTu, ngay) {
    var lech = 0;
    var buoi = '';
    switch (soThuTu) {
        case '0':
            lech = 0;
            buoi = 'Tối';
            break;
        case '1':
            lech = 1;
            buoi = 'Tối';
            break;
        case '2':
            lech = 2;
            buoi = 'Tối';
            break;
        case '3':
            lech = 3;
            buoi = 'Tối';
            break;
        case '4':
            lech = 4;
            buoi = 'Tối';
            break;
        case '5':
            lech = 5;
            buoi = 'Tối';
            break;
        case '6':
            lech = 5;
            buoi = 'Sáng';
            break;
        case '7':
            lech = 5;
            buoi = 'Chiều';
            break;
        case '8':
            lech = 6;
            buoi = 'Sáng';
            break;
        case '9':
            lech = 6;
            buoi = 'Chiều';
            break;
    }
    var date = new Date(ngay);
    var dateNextMonday = date.setDate(date.getDate() + lech);
    var nextMonday = new Date(dateNextMonday);
    return {
        buoi: buoi,
        ngay: nextMonday.getDate(),
        thang: nextMonday.getMonth() + 1,
        nam: nextMonday.getYear() + 1900,
    };
}

function thuNgayThang(day, stt) {
    switch (stt) {
        case '0':
            return 'Thứ 2 (' + getDay('0', day).ngay + '/' + getDay('0', day).thang + ')';
        case '1':
            return 'Thứ 3 (' + getDay('1', day).ngay + '/' + getDay('1', day).thang + ')';;
        case '2':
            return 'Thứ 4 (' + getDay('2', day).ngay + '/' + getDay('2', day).thang + ')';;
        case '3':
            return 'Thứ 5 (' + getDay('3', day).ngay + '/' + getDay('3', day).thang + ')';;
        case '4':
            return 'Thứ 6 (' + getDay('4', day).ngay + '/' + getDay('4', day).thang + ')';;
        case '5':
            return 'Thứ 7 (' + getDay('5', day).ngay + '/' + getDay('5', day).thang + ')';;
        case '6':
            return 'Sáng 7 (' + getDay('6', day).ngay + '/' + getDay('6', day).thang + ')';;
        case '7':
            return 'Chiều 7 (' + getDay('7', day).ngay + '/' + getDay('7', day).thang + ')';;
        case '8':
            return 'Sáng CN (' + getDay('8', day).ngay + '/' + getDay('8', day).thang + ')';;
        case '9':
            return 'Chiều CN (' + getDay('9', day).ngay + '/' + getDay('9', day).thang + ')';;
    }
}

function laBuoiThuNhat(soThuTu) {
    switch (soThuTu) {
        case '0':
            return true;
        case '1':
            return true;
        case '2':
            return true;
        case '6':
            return true;
        case '7':
            return true;
        default:
            return false;
    }
}

var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

function getFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
}

// Test Prep 9................................................................................................
// Xep lich của chị Hương
app.post("/xep-lich-test-prep9", upload.fields([
    { name: 'listGiaoVien', maxCount: 1 },
    { name: 'ngay', maxCount: 1 },
    { name: 'Giáo Viên0', maxCount: 1 },
    { name: 'Giáo Viên1', maxCount: 1 },
    { name: 'Giáo Viên2', maxCount: 1 },
    { name: 'Giáo Viên3', maxCount: 1 },
    // { name: 'Giáo Viên4', maxCount: 1 },
    // { name: 'Giáo Viên5', maxCount: 1 },
    { name: 'Back-up0', maxCount: 1 },
    { name: 'Back-up1', maxCount: 1 },
    { name: 'Back-up2', maxCount: 1 },
    { name: 'Back-up3', maxCount: 1 },
    // { name: 'Back-up4', maxCount: 1 },
    // { name: 'Back-up5', maxCount: 1 },
]), async(req, res) => {
    console.log(req.body);
    console.log(req.files);
    var ngay = req.body.ngay;
    var day = new Date(ngay);

    // Check xem lịch cũ có chưa
    let sheetName = `${day.getDate()}.${day.getMonth()+1}.${day.getYear()+1900}`;
    // var lichCu;
    // try {
    //     var ahihi = await axios.get(
    //         'https://script.google.com/macros/s/AKfycbw5tyyVetGJ_woM8mOrIoJBc0otQGtm7-C7xTq23uOekBa4Jaj-SmPzY-ko9wWVaLk-ww/exec?sheetName=' + sheetName, {
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //             },
    //         },
    //     );
    //     lichCu = ahihi.data;
    // } catch (er) {
    //     console.error(er);
    // }

    // if (lichCu && lichCu.result == 'success') {
    //     var lichHoc = '';
    //     for (var soThuTu in [1, 1, 1, 1, 1, 1]) {
    //         let keyA = 'Giáo Viên' + soThuTu;
    //         let keyB = 'Back-up' + soThuTu;
    //         if (lichCu.data[keyA] != req.body[keyA]) {
    //             lichHoc +=
    //                 'Đã chuyển khối 9 ngày ' + sheetName +
    //                 ' Giáo viên [' + 'Chính thức' + '] buổi [' + getDayTestPrep9(day, soThuTu).fullDate +
    //                 '] từ [' + lichCu.data[keyA] + '] sang [' + req.body[keyA] + ']\n';
    //         }
    //         if (lichCu.data[keyB] != req.body[keyB]) {
    //             lichHoc +=
    //                 'Đã chuyển khối 9 ngày ' + sheetName +
    //                 ' Giáo viên [' + 'Back up' + '] buổi [' + getDayTestPrep9(day, soThuTu).fullDate +
    //                 '] từ [' + lichCu.data[keyB] + '] sang [' + req.body[keyB] + ']\n';
    //         }
    //     }

    // // Gửi mail:
    // if (lichHoc) {
    //     var transporter = nodemailer.createTransport({
    //         service: 'gmail',
    //         auth: {
    //             user: 'clevai.xep.lich@gmail.com',
    //             pass: 'Hoai1234@@'
    //         }
    //     });
    //     var mailOptions2 = {
    //         from: 'clevai.xep.lich@gmail.com',
    //         to: 'duchoang191@gmail.com',
    //         subject: '[Lớp 9 Test_Prep_' + sheetName + '] Yêu cầu thay đổi slide do chuyển lịch học ' + sheetName,
    //         text: lichHoc,
    //     };
    //     transporter.sendMail(mailOptions2, function(error, info) {
    //         if (error) {
    //             console.log('Email sent failed: ' + error);
    //         } else {
    //             console.log('Email sent: ' + info.response);
    //         }
    //     });
    // }
    // }
    // Gửi mail:
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'clevai.xep.lich@gmail.com',
            pass: 'Hoai1234@@'
        }
    });
    var mailOptions2 = {
        from: 'clevai.xep.lich@gmail.com',
        to: 'duchoang191@gmail.com',
        subject: '[Lớp 9 Test_Prep_' + sheetName + '] Yêu cầu thay đổi slide do chuyển lịch học ' + sheetName,
        text: JSON.stringify(req.body),
    };
    transporter.sendMail(mailOptions2, function(error, info) {
        if (error) {
            console.log('Email sent failed: ' + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    // Ghi lại
    try {
        req.body['sheetName'] = sheetName;
        let sendData = getFormData(req.body);
        let result = await axios.post(
            'https://script.google.com/macros/s/AKfycbw5tyyVetGJ_woM8mOrIoJBc0otQGtm7-C7xTq23uOekBa4Jaj-SmPzY-ko9wWVaLk-ww/exec',
            sendData, {
                headers: sendData.getHeaders(),
            },
        );
        if (result.data && result.data.result == 'success') {
            res.status(200).send({ "message": 'success' });
        } else {
            console.log('Xep lich fail: ' + JSON.stringify(result));
            res.status(200).send({ "message": 'failed' });
        }
    } catch (error) {
        console.log('Xep lich fail: ' + JSON.stringify(error));
        res.status(200).send({ "message": 'failed ' + error });
    }

    return;
});

function getDayTestPrep9(ngay, soThuTu) {
    var lech = 0;
    var buoi = '';
    switch (soThuTu) {
        case '0':
            lech = 0;
            buoi = 'Tối';
            break;
        case '1':
            lech = 1;
            buoi = 'Tối';
            break;
        case '2':
            lech = 3;
            buoi = 'Tối';
            break;
        case '3':
            lech = 4;
            buoi = 'Tối';
            break;
        case '4':
            lech = 5;
            buoi = 'Chiều';
            break;
        case '5':
            lech = 6;
            buoi = 'Chiều';
            break;
    }
    var date = new Date(ngay);
    var dateNextMonday = date.setDate(date.getDate() + lech);
    var nextMonday = new Date(dateNextMonday);
    var fullDate = '';
    switch (soThuTu) {
        case '0':
            fullDate = 'Thứ 2 (' + nextMonday.getDate() + '/' + (nextMonday.getMonth() + 1) + ')';
            break;
        case '1':
            fullDate = 'Thứ 3 (' + nextMonday.getDate() + '/' + (nextMonday.getMonth() + 1) + ')';
            break;
        case '2':
            fullDate = 'Thứ 5 (' + nextMonday.getDate() + '/' + (nextMonday.getMonth() + 1) + ')';
            break;
        case '3':
            fullDate = 'Thứ 6 (' + nextMonday.getDate() + '/' + (nextMonday.getMonth() + 1) + ')';
            break;
        case '4':
            fullDate = 'Chiều T7 (' + nextMonday.getDate() + '/' + (nextMonday.getMonth() + 1) + ')';
            break;
        case '5':
            fullDate = 'Chiều CN (' + nextMonday.getDate() + '/' + (nextMonday.getMonth() + 1) + ')';
            break;
    }
    return {
        ngay: nextMonday.getDate(),
        thang: nextMonday.getMonth() + 1,
        nam: nextMonday.getYear() + 1900,
        fullDate: fullDate,
        buoi: buoi,
    };
}

app.post("/sapXep-test-prep9", upload.fields([
    // Trong form có field nào thì define chỗ này
    { name: 'powerpointA1', maxCount: 1 },
    { name: 'powerpointA2', maxCount: 1 },

    { name: 'ngay', maxCount: 1 },
    { name: 'Giáo Viên0', maxCount: 1 },
    { name: 'Giáo Viên1', maxCount: 1 },
    { name: 'Giáo Viên2', maxCount: 1 },
    { name: 'Giáo Viên3', maxCount: 1 },
    // { name: 'Giáo Viên4', maxCount: 1 },
    // { name: 'Giáo Viên5', maxCount: 1 },
]), async(req, res) => {
    console.log(req.body);
    console.log(req.files);
    var ngay = req.body.ngay;
    var day = new Date(ngay);
    // var chuNhat = getDay('9', day);
    var tenFile = 'DaXepLich_' + day.getDate() + '.' + (day.getMonth() + 1);
    // var khoi = 'Lop' + req.body.khoi;
    function laBuoiThuNhatTestPrep(soThuTu) {
        switch (soThuTu) {
            case '0':
                return true;
            case '1':
                return true;
                // case '2':
                //     return true;
            default:
                return false;
        }
    }
    // Xu ly
    for (var soThuTu in [1, 1, 1, 1, 1, 1]) {
        let keyA = 'Giáo Viên' + soThuTu;
        // let keyB = 'B' + soThuTu;
        // let keyC = 'C' + soThuTu;
        var soThuTuFile = laBuoiThuNhatTestPrep(soThuTu) ? '1' : '2';
        var functionA = new Promise(async(done, close) => {
            try {
                // var result = await copyFile(req.files['powerpointA' + soThuTuFile][0], req.body[keyA], soThuTu, tenFile, day);
                // Với Xo -> Ném file files[powerpointX(soThuTuFile(o))] 
                // vào thư mục fields[Xo]
                // Và đổi tên file thành Blabla_fields[Xo].pptx
                var dir = tenFile + '/' + req.body[keyA];
                var day = getDayTestPrep9(ngay, soThuTu);
                var newName =
                    day.ngay + '.' + day.thang +
                    '(' + day.buoi + ')_' +
                    req.body[keyA] + '_' +
                    req.files['powerpointA' + soThuTuFile][0].originalname;
                try {
                    if (req.files['powerpointA' + soThuTuFile][0] && req.body[keyA]) {
                        if (!fs.existsSync(dir)) {
                            await fs.mkdirSync(dir, {
                                recursive: true
                            });
                        }
                        await fs.copyFileSync(
                            'uploads/' + req.files['powerpointA' + soThuTuFile][0].originalname,
                            dir + '/' + newName,
                        );
                        done(newName);
                    } else {
                        done('');
                    }
                } catch (error) {
                    done(error + ' ' + newName);
                }
            } catch (error) {
                done('');
                console.error('copyFile error: ' + error);
            }
        });
        await Promise.all([functionA]);
    }

    // Don dep
    var arrPromise = [
        'powerpointA1',
        'powerpointA2'
    ].map(file => new Promise(async(ok) => {
        try {
            if (req.files[file]) { await fs.unlinkSync('uploads/' + req.files[file][0].originalname); }
        } catch (error) {
            // ko quan taam
        }
        ok();
    }));
    await Promise.all(arrPromise);

    /// Nen lai
    var output = fs.createWriteStream(tenFile + '.zip');
    var archive = archiver('zip');
    output.on('close', function() {
        deleteFolderRecursive(tenFile);
    });
    archive.on('error', function(err) {
        throw err;
    });
    archive.pipe(output);
    archive.directory(tenFile, false);
    await archive.finalize();

    // Send file
    res.status(200).send({ "tenFile": tenFile + '.zip' });
});