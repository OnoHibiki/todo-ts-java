package com.example.todo.controller;

import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/todos")
//フロント(Next.js)から叩けるようにCROS許可（まずはローカル）
@CrossOrigin(origins = "http://localhost:3000")


public class TodoController {

    //メモリ上の簡易DB
    private final List<TodoDto> store = new CopyOnWriteArrayList<>();
    private final AtomicLong seq = new AtomicLong(0);

    //コンストラクタ
    public TodoController() {
        store.add(new TodoDto(seq.incrementAndGet(), "(初期)アロエを集める", LocalDate.now().plusDays(2), false));
        store.add(new TodoDto(seq.incrementAndGet(), "(初期)森を破壊する", LocalDate.now().plusDays(80), false));
    }


    //Post時に実行されるメソッド
    @PostMapping
    public TodoDto create(@RequestBody CreateTodoReq req) {
        LocalDate deadline = (req.deadline() != null) ? req.deadline() : LocalDate.now();
        TodoDto created = new TodoDto(
            seq.incrementAndGet(), 
            req.title(), 
            deadline,
            req.completed() != null ? req.completed() : false
        );
    store.add(created);
    return created;    
    }
    



    //recordクラスを使用
    public record TodoDto(Long id, String title, LocalDate deadline, boolean completed) {}
    public record CreateTodoReq(String title, LocalDate deadline, Boolean completed){}
}