[
{req: get('unittest', 'reset'), assert:true},
{req: get('basic', 'get'), data:{str:'abc', num:123}, assert:{str:'abc', num:123}},
{req: post('basic', 'post'), data:{str:'abc', num:123}, assert:{str:'abc', num:123}}
]
