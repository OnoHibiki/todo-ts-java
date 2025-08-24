package com.example.todo.controller;

import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;



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


    //Todo作成
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
    
    //Todo削除
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        boolean removed = store.removeIf(t -> t.id().equals(id));
        if(!removed) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Todoが既に存在しません");
        }
    }

    //Todoの完了管理
    @PutMapping("/{id}/toggle")
    public TodoDto toggle(@PathVariable Long id) {
        for (int i = 0; i < store.size(); i++){
            TodoDto t = store.get(i);
            if (t.id().equals(id)) {
                TodoDto updated = new TodoDto(t.id(), t.title(), t.deadline(), !t.completed());
                store.set(i, updated);
                return updated;
            }
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Todoが存在しません");
    }


    //recordクラスを使用
    public record TodoDto(Long id, String title, LocalDate deadline, boolean completed) {}
    public record CreateTodoReq(String title, LocalDate deadline, Boolean completed){}
}