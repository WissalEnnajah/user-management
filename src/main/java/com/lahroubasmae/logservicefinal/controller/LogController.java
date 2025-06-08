package com.lahroubasmae.logservicefinal.controller;


import com.lahroubasmae.logservicefinal.model.Log;
import com.lahroubasmae.logservicefinal.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class LogController {

    @Autowired
    private LogService logService;

    @PostMapping
    public ResponseEntity<Log> logAction(@RequestBody Log log) {
        Log savedLog = logService.saveLog(log);
        return new ResponseEntity<>(savedLog, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Log>> getAllLogs() {
        return ResponseEntity.ok(logService.getAllLogs());
    }

    @GetMapping("/user/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Log>> getLogsByUser(@PathVariable String email) {
        return ResponseEntity.ok(logService.getLogsByUser(email));
    }
}
