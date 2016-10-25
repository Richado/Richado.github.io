
var log = function() {
    console.log.apply(console, arguments)
}

var todoList = []


var currentTime = function() {
    var d = new Date()
    var month = d.getMonth() + 1
    var date = d.getDate()
    var hours = d.getHours()
    var minutes = d.getMinutes()
    var seconds = d.getSeconds()
    var timeString = `${month}/${date} ${hours}:${minutes}:${seconds}`
    return timeString
}

// 保存 todoList
var saveTodos = function() {
    var s = JSON.stringify(todoList)
    localStorage.todoList = s
}

var loadTodos = function() {
    var s = localStorage.todoList
    return JSON.parse(s)
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

var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
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
            <span contenteditable='false' id='span-edit'>${todo.task}</span>
            <span>${todo.time}</span>
            <br>
            <button class='pure-button todo-done button-small pure-button-primary'>完成</button>
            <button class='pure-button todo-delete button-small button-error'>删除</button>
            <button class='pure-button todo-edit button-small'>编辑</button>
        </div>
    `
    return t
}

// 给 add button 绑定添加 todo 事件   addTodo()
var addButton = document.querySelector('#id-button-add')
console.log('addButton: ', addButton)
addButton.addEventListener('click', function(){
    // 获得 input.value
    var todoInput = document.querySelector('#id-input-todo')
    var task = todoInput.value
    // todo 对象
    var todo = {
        'task': task,
        'time': currentTime()
    }
    todoList.push(todo)
    saveTodos()
    insertTodo(todo)
})

// 给 add Completele 按钮  绑定事件     allTodos()
// var addComplete = document.querySelector('#id-button-add2')
// console.log('addComplete: ', addComplete)
// addComplete.addEventListener('click', function() {
//     // allTodos()
//
// })

// 给 delete complete 按钮 绑定事件  deleteAllTodos()
var deleteComplete = document.querySelector('#id-button-deleteAll')
deleteComplete.addEventListener('click', function() {
    // delete all todo-cells
    var todoCells = document.querySelectorAll('.todo-cell')
    for (var i = 0; i < todoCells.length; i++) {
        todoCells[i].remove()
    }
    // deleteAllTodos()
    todoList.splice(0)
    saveTodos()
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
        todoList[index-1].task = target.innerHTML
        // todoList.splice(index, 1)
        saveTodos()
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
        toggleClass(todoDiv, 'done')
        // 点击 删除按钮
    } else if (target.classList.contains('todo-delete')) {
        log('delete')
        var todoDiv = target.parentElement
        var index = indexOfElement(target.parentElement)
        log('delete index',  index+1)
        //从页面中删除 todo
        todoDiv.remove()
        // 把元素从 todoList 中 delete 掉    deleteTodo()
        todoList.splice(index, 1)
        saveTodos()
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



// 程序加载后, 加载 todoList 并且添加到页面中
todoList = loadTodos()
for (var i = 0; i < todoList.length; i++) {
    var todo = todoList[i]
    insertTodo(todo)
}
