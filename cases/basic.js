[
{req: get('unittest', 'reset'), assert:true},
{req: get('basic', 'get'), data:{str:'abc', num:123}, assert:{str:'abc', num:123}},
{req: post('basic', 'post'), data:{str:'abc', num:123}, assert:{str:'abc', num:123}},
{
    req: get('basic', 'get'),
    data:{
        str:'abc',
        num:123,
        arr: [1,2,3],
        obj: {num:123,str:'abc'},
        ign: 'abc'
    },
    assert:{
        str:'abc',
        num:123,
        arr: [1,2,3],
        obj: {num:123,str:'abc'},
        ign: ignore
    }
},
]
