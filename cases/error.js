[
{
    req: get('basic', 'error'),
    data:{
        str:'abc',
        num:123,
        arr: [1,2,3],
        obj: {num:123,str:'abc'},
        ign: 'abc'
    },
    assert:{
        str:'aaa',
        num:1,
        arr: [1,2,5],
        obj: {num:1,str:'c'},
        ext: 'aaa'
    }
},
{
    req: get('basic', 'error'),
    data:{
        str:'abc',
        num:123,
        arr: [1,2,3],
        obj: {num:123,str:'abc'},
        ign: 'abc'
    },
    assert:{
        str:'aaa',
        num:'1',
        arr: 123,
        obj: {num:1,str:'c'},
        ign: ignore,
        ext: 'aaa'
    }
},
]
