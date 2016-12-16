[
{
    req:get('basic', 'save'),
    data:{token:'abc'},
    assert:{token:save('token')}
},
{
    req:get('basic', 'save'),
    data:{token:use('token')},
    assert:{token:'abc'}
}
]
