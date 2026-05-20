package com.example.fuel.receipt.manager.controllers;

import com.example.fuel.receipt.manager.dtos.OcrResponseDTO;
import com.example.fuel.receipt.manager.services.interfaces.TesseractOcrService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("${application.api.path}/ocr")
public class OcrController {

    private final TesseractOcrService tesseractOcrService;

    public OcrController(TesseractOcrService tesseractOcrService) {
        this.tesseractOcrService = tesseractOcrService;
    }

    @PostMapping("/scan")
    public ResponseEntity<OcrResponseDTO> scan(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(tesseractOcrService.recognizeText(file.getInputStream()));
    }
}