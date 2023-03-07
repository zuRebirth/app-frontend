const tableConfig = {
    tableData: [
        {
            id: 1,
            appointmentUserName: '张三',
            sampleName: '苹果',
            checkItemName: '农药残留',
            valueStandardOp: '<=50%',
            checkData: '24.1%',
            checkChannel: 'A5',
            checkInhibitionRatio: '24.1%',
            recheckData: '',
            recheckChannel: '',
            recheckInhibitionRatio: '',
            checkResult: 1,
            checkBy: '张三',
            appointmentTime: '2022-01-05 08:12:18'
        },
        {
            id: 2,
            appointmentUserName: '张三',
            sampleName: '苹果',
            checkItemName: '农药残留',
            valueStandardOp: '<=50%',
            checkData: '',
            checkChannel: '',
            checkInhibitionRatio: '',
            recheckData: '',
            recheckChannel: '',
            recheckInhibitionRatio: '',
            checkResult: '',
            checkBy: '',
            appointmentTime: ''
        },
        {
            id: 3,
            appointmentUserName: '张三',
            sampleName: '苹果',
            checkItemName: '农药残留',
            valueStandardOp: '<=50%',
            checkData: '24.1%',
            checkChannel: 'A5',
            checkInhibitionRatio: '24.1%',
            recheckData: '',
            recheckChannel: '',
            recheckInhibitionRatio: '',
            checkResult: 0,
            checkBy: '张三',
            appointmentTime: '2022-01-05 08:12:18'
        },
        {
            id: 4,
            appointmentUserName: '张三',
            sampleName: '苹果',
            checkItemName: '农药残留',
            valueStandardOp: '<=50%',
            checkData: '24.1%',
            checkChannel: 'A5',
            checkInhibitionRatio: '24.1%',
            recheckData: '33.3%',
            recheckChannel: 'A8',
            recheckInhibitionRatio: '32.1%',
            checkResult: 0,
            checkBy: '张三',
            appointmentTime: '2022-01-05 08:12:18'
        }
    ]
}

export default tableConfig
