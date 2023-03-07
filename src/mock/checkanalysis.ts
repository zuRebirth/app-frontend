import Mock from 'mockjs';

let listdata: any[] = [];
for (let i = 0; i < 5; i++) {
    listdata.push({
        basicItemName: '苹果',
        checkCount: Mock.Random.natural(20, 50),
        checkFailCount: Mock.Random.natural(0, 40),
        checkPassCount: Mock.Random.natural(0, 40),
        current: 1,
        pageSize: 10,
        region: '批发市场',
        requestNo: '20180102qwerut6782',
        sampleName: '苹果',
        stall: '3号楼A区18号'
    })
}

const list = {
    code: 200,
    message: 'ok',
    data: {
        page: 1,
        limit: 10,
        total: 50,
        data:listdata
    }
}

const list1 = {
    code: 200,
    message: 'ok',
    data: {
        page: 1,
        limit: 10,
        total: 50,
        data: [{
            checkCount: '20',
            checkFailCount: '4',
            checkPassCount: '10',
            region: '批发市场',
        }]
    }
}

let list2data: any[] = [];

for (let i = 0; i < 7; i++) {
    list2data.push({
        checkCount: Mock.Random.natural(40, 50).toString(),
        checkFailCount: Mock.Random.natural(0, 20).toString(),
        checkPassCount: Mock.Random.natural(0, 30).toString(),
        time: '2022-08-' + (i + 22).toString()
    })
}

const list2 = {
    code: 200,
    message: 'ok',
    data: {
        page: 1,
        limit: 10,
        total: 50,
        data: list2data
    }
}


const list3 = {
    code: 200,
    message: 'ok',
    data: {
        page: 1,
        limit: 10,
        total: 50,
        data: [{
            checkCount: '50',
            checkFailCount: '24',
            checkPassCount: '20',
            stall: '3号楼A区18号'
        }]
    }
}

const list4 = {
    code: 200,
    message: 'ok',
    data: {
        page: 1,
        limit: 10,
        total: 50,
        data: [{
            checkCount: '50',
            checkFailCount: '34',
            checkPassCount: '10',
            sampleName: '苹果'
        }]
    }
}

export default [
    {
        url: '/api/check-task-analysis/listFl',
        method: 'post',
        response: () => {
            return list;
        }
    },
    {
        url: '/api/check-task-analysis/getAnRegion',
        method: 'post',
        response: () => {
            return list1;
        }
    },
    {
        url: '/api/check-task-analysis/getAnCurrent',
        method: 'post',
        response: () => {
            return list2;
        }
    },
    {
        url: '/api/check-task-analysis/getAnStall',
        method: 'post',
        response: () => {
            return list3;
        }
    },
    {
        url: '/api/check-task-analysis/getAnSample',
        method: 'post',
        response: () => {
            return list4;
        }
    }
];