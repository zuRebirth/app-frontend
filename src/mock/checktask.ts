// const list = {
//     code: 200,
//     message: 'ok',
//     data: {
//         page: 1,
//         limit: 10,
//         total: 50,
//         data: [{
//             appointmentCode: "T114514",
//             appointmentTimes: "2022-08-01 08:55:49",
//             appointmentUsers: "张三",
//             createBy: "张三",
//             createTime: "2022-08-01 08:55:49",
//             id: 1,
//             status: 1,
//             taskCode: "1919810"
//         }]
//     }
// };

// const list1 = {
//     code: 200,
//     message: 'ok',
//     data: {
//         page: 1,
//         limit: 10,
//         total: 50,
//         data: [{
//             appointmentUserName: '张三',
//             checkBy: '张三',
//             checkChannel: 'A5',
//             checkData: '50%',
//             checkInhibitionRatio: 0,
//             checkItemName: '苹果',
//             checkResult: 0,
//             checkTime: "2022-08-02 04:22:00",
//             id: 1,
//             inputType: 1,
//             sampleName: '苹果',
//             unit: '%',
//             valueStandard: '30',
//             valueStandardOp: '>'
//         }]
//     }
// };

// const list2 = {
//     code: 200,
//     message: 'ok',
//     data: {
//         page: 1,
//         limit: 10,
//         total: 50,
//         data: [{
//             appointmentTime: '2022-08-02 06:57:39',
//             appointmentUserName: '张三',
//             checkChannel: 'A5',
//             checkData: '30',
//             checkInhibitionRatio: 0,
//             checkItemName: '香蕉',
//             checkResult: 1,
//             id: 1,
//             inputType: 0,
//             mobile: '123456767',
//             recheckChannel: 'A5',
//             recheckData: '30',
//             recheckInhibitionRatio: '30',
//             recheckResult: 0,
//             remarks: 'AAA',
//             sampleName: '香蕉',
//             unit: '%',
//             valueStandard: '30',
//             valueStandardOp: '>',
//             wasteMethod: 'AAA',
//             wasteWeight: 0
//         }]
//     }
// };

// export default [
//     {
//         url: '/api/check-task/query',
//         method: 'post',
//         response: () => {
//             return list;
//         }
//     },
//     {
//         url: '/api/recheck-task-list/query',
//         method: 'post',
//         response: () => {
//             return list1;
//         }
//     },
//     {
//         url: '/api/check-task-result/query',
//         method: 'post',
//         response: () => {
//             return list2;
//         }
//     }
// ];


