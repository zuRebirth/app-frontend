const list = {
    code: 200,
    message: 'ok',
    data: {
        page: 1,
        limit: 10,
        total: 50,
        data: [{
            amount: 110,
            appointmentCode: '11223',
            appointmentTime: '2022-08-02 08:49:04',
            appointmentUserName: '张三',
            chargeChannel: '银行卡通道',
            chargeWay: '微信',
            checkAppointmentId: 1,
            checkPrice: '23',
            checkPriceDesc: '333',
            goodsNum: 110,
            id: 1,
            payTime: '2022-08-02 08:49:04',
            payType: 2
        }]
    }
};

export default [
    {
        url: '/api/check-appointment-payment/list',
        method: 'post',
        response: () => {
            return list;
        }
    }
];
