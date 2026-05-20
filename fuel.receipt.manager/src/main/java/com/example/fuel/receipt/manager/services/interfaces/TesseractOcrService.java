package com.example.fuel.receipt.manager.services.interfaces;

import com.example.fuel.receipt.manager.dtos.OcrResponseDTO;

import java.io.IOException;
import java.io.InputStream;

public interface TesseractOcrService {
    OcrResponseDTO recognizeText(InputStream inputStream) throws IOException;
}
