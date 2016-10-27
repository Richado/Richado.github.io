
// 回调函数
function acall(callback) {
    //先执行
    allTodos()
    callback
}

var insertBody = function() {
    var myBody = document.querySelector('body')
    var t = `
            <div class="todo-main">
                <!-- todo 输入框 -->
                <div class="todo-form">
                    <input id='id-input-todo' type="text">
                    <button id='id-button-add' type="button">Add</button>
                    <button id='id-button-add2' type="button">Add Completele</button>
                    <button id='id-button-deleteAll' type="button">Delete Completele</button>
                </div>
                <!-- todo 列表 -->
                <div id="id-div-container">
                    <!-- <div class='todo-cell'>
                        <button class='todo-done'>完成</button>
                        <button class='todo-delete'>删除</button>
                        <button class='todo-edit'>编辑</button>
                        <span contenteditable='true'>上课</span>
                    </div> -->
                </div>
            </div>`
    myBody.insertAdjacentHTML('beforebegin', t)
}
insertBody()

var log = function() {
    console.log.apply(console, arguments)
}

// 返回自己在父元素中的下标
var indexOfElement = function(element) {
    var parent = element.parentElement
    for (var i = 0; i < parent.children.length; i++) {
        var e = parent.children[i]
        if (e === element) {
            return i
        }
    }
}

var insertTodo = function(todo) {
    // 添加到 container 中
    var todoContainer = document.querySelector('#id-div-container')
    var t = templateTodo(todo)
    // 这个方法用来添加元素更加方便, 不需要 createElement
    todoContainer.insertAdjacentHTML('beforeend', t);
}
var templateTodo = function(todo) {
    var t = `
        <div class='todo-cell'>
            <button class='todo-done'>完成</button>
            <button class='todo-delete'>删除</button>
            <button class='todo-edit'>编辑</button>
            <span>${todo.id}</span>
            <span contenteditable='true' id='span-edit'>${todo.task}</span>
        </div>
    `
    return t
}

// 给 add button 绑定添加 todo 事件   addTodo()
var addButton = document.querySelector('#id-button-add')
addButton.addEventListener('click', function(){
    // 获得 input.value
    var todoInput = document.querySelector('#id-input-todo')
    var task = todoInput.value
    addTodo(task)
})

// 给 add Completele 按钮  绑定事件     allTodos()
var addComplete = document.querySelector('#id-button-add2')
addComplete.addEventListener('click', function() {
    allTodos()
})

// 给 delete complete 按钮 绑定事件  deleteAllTodos()
var deleteComplete = document.querySelector('#id-button-deleteAll')
deleteComplete.addEventListener('click', function() {
    deleteAllTodos()
})


var todoContainer = document.querySelector('#id-div-container')

//直接在 edit-span 中修改 todo:task    updateTodo()
todoContainer.addEventListener('keydown', function(event){
    log('container wodeceshi')
    var target = event.target
    if(event.key === 'Enter') {
        log('按了回车')
        // 失去焦点
        target.blur()
        //让 todo-edit 不可编辑
        var editSpan = document.querySelectorAll('#span-edit')
        log('现在span不可编辑')
        for (var i = 0; i < editSpan.length; i++) {
            editSpan[i].setAttribute('contenteditable', 'false')
        }
        // 阻止默认行为的发生, 也就是不插入回车
        event.preventDefault()
        // 更新 todoList
        var index = indexOfElement(target.parentElement)
        log('update index',  index+1)
        // 把元素在 todoList 中更新
        // allTodos()
        var updateID = myRes[index].id
        var updateTaskValue = target.innerHTML
        acall(updateTodo(updateID, updateTaskValue))
        // updateTodo(updateID, updateTaskValue)
    }
})

// 通过 event.target 的 class 来检查点击的是什么
todoContainer.addEventListener('click', function(event){
    log('container click', event, event.target)
    var target = event.target
    // 点击 完成按钮
    if(target.classList.contains('todo-done')) {
        log('done')
        // 给 todo div 开关一个状态 class
        var todoDiv = target.parentElement
        // toggleClass(todoDiv, 'done')
        todoDiv.style.color = 'grey'
        todoDiv.style.textDecoration = 'line-through'
        // 点击 删除按钮
    } else if (target.classList.contains('todo-delete')) {
        log('delete')
        var todoDiv = target.parentElement
        var index = indexOfElement(target.parentElement)
        log('delete index',  index+1)
        //从页面中删除 todo
        todoDiv.remove()
        // 把元素从 todoList 中 delete 掉    deleteTodo()
        // delete todoList[index]
        // allTodos()
        var id = myRes[index].id
        acall(deleteTodo(id))
        // 点击 编辑按钮
    } else {
        log('edit')
        var todoDiv = target.parentElement
        var index = indexOfElement(target.parentElement)
        log('edit index',  index+1)
        // 让edit-span 可以被编辑
        var editSpan = document.querySelectorAll('#span-edit')
        editSpan[index].setAttribute('contenteditable', 'true')
    }
})



// 删除所有 todo
var deleteAllTodos = function() {
    for (var i = 0; i < myRes.length; i++) {
        var id = myRes[i].id
        var deleteUrl = 'http://vip.cocode.cc:3000/todo/657723073/delete/' + id
        var ajaxDelete = function(url, callback) {
            var r = new XMLHttpRequest()
            r.open('GET', url, true)
            r.onreadystatechange = function() {
                if (r.readyState === 4) {
                    // console.log('state change', r)
                    callback(r.response)
                }
            }
            r.send()
        }
        ajaxDelete(deleteUrl, function(response) {
            var res = JSON.parse(response)
            console.log('删除成功，这是被删除的todo：', res)
        })
    }
}



/*
'''
todo 后端程序提供了 4 个 API, 说明如下


1, 获得所有的 todo, 返回的是一个数组

GET
http://vip.cocode.cc:3000/todo/<你的qq号>/all
*/
var allTodos = function() {
    var allUrl = 'http://vip.cocode.cc:3000/todo/657723073/all'
    var ajaxGet = function(url, callback) {
        var r = new XMLHttpRequest()
        r.open('GET', url, true)
        r.onreadystatechange = function() {
            // callback(r.response)
            if (r.readyState === 4) {
                // console.log('state change', r)
                callback(r.response)
            }
        }
        r.send()
    }
    ajaxGet(allUrl, function(response) {
        var res = JSON.parse(response)
        window.myRes = res
        console.log('获取成功：', res)
    })
}


/*
2, 发送 JSON 格式字符串来创建一个 todo
要求设置 Content-Type 为 application/json

POST
{"task": "study"}
http://vip.cocode.cc:3000/todo/<你的qq号>/add
*/

    var addTodo = function(taskValue) {
    var addUrl = 'http://vip.cocode.cc:3000/todo/657723073/add'
    var obj = {
        'task': taskValue
    }
    var data = JSON.stringify(obj)
    var ajaxPost = function(url, data, callback) {
        var r = new XMLHttpRequest()
        r.open('POST', url, true)
        r.setRequestHeader('Content-Type', 'application/json')
        r.onreadystatechange = function() {
            if (r.readyState === 4) {
                callback(r.response)
            }
        }
        r.send(data)
    }
    ajaxPost(addUrl, data, function(response) {
        var res = JSON.parse(response)
        console.log(res)
        if (res.id) {
            console.log('添加成功')
        }
        insertTodo(res)
    })
}


/*
3, 发送 JSON 格式字符串来更新一个 todo

POST
{"task": "study"}
http://vip.cocode.cc:3000/todo/<你的qq号>/update/<todo_id>
*/


var updateTodo = function(id, taskValue) {
    var updateUrl = 'http://vip.cocode.cc:3000/todo/657723073/update/' + id
    var obj = {
        'task': taskValue
    }
    var data = JSON.stringify(obj)
    var ajaxUpdate = function(url, data, callback) {
        var r = new XMLHttpRequest()
        r.open('POST', url, true)
        r.setRequestHeader('Content-Type', 'application/json')
        r.onreadystatechange = function() {
            if (r.readyState === 4) {
                callback(r.response)
            }
        }
        r.send(data)
    }
    ajaxUpdate(updateUrl, data, function(response) {
        var res = JSON.parse(response)
        if (res.qq === '657723073') {
            console.log('修改成功：', res)
        } else {
            console.log('修改失败：此ID不属于你');
        }
    })
}


/*
4, 删除一个 todo
GET
http://vip.cocode.cc:3000/todo/<你的qq号>/delete/<todo_id>

'''
*/
var deleteTodo = function(id) {
    var deleteUrl = 'http://vip.cocode.cc:3000/todo/657723073/delete/' + id
    var ajaxDelete = function(url, callback) {
        var r = new XMLHttpRequest()
        r.open('GET', url, true)
        r.onreadystatechange = function() {
            if (r.readyState === 4) {
                // console.log('state change', r)
                callback(r.response)
            }
        }
        r.send()
    }

    ajaxDelete(deleteUrl, function(response) {
        var res = JSON.parse(response)
        console.log('删除成功，这是被删除的todo：', res)
    })
}
