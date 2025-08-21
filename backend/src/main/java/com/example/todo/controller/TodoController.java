package com.example.todo.controller;

import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
//フロント(Next.js)から叩けるようにCROS許可（まずはローカル）
@CrossOrigin(origins = "http://localhost:3000")

public class TodoController {

    //一旦、固定データ（モック）を返す
    @GetMapping
    public List<TodoDto> findAll() {
        return List.of(
            new TodoDto(1L, "(サンプル)本を買う",  LocalDate.now().plusDays(1), false),
            new TodoDto(2L, "(サンプル)牛乳を読む",  LocalDate.now().plusDays(2), true)
        );
    }

    //recordクラスを使用
    public record TodoDto(Long id, String title, LocalDate deadline, boolean completed) {}
}