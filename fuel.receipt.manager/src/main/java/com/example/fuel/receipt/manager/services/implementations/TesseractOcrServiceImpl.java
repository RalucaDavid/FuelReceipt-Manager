package com.example.fuel.receipt.manager.services.implementations;

import com.example.fuel.receipt.manager.dtos.OcrResponseDTO;
import com.example.fuel.receipt.manager.exceptions.ResourceNotFoundException;
import com.example.fuel.receipt.manager.services.interfaces.TesseractOcrService;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TesseractOcrServiceImpl implements TesseractOcrService {

    private static final Logger logger = LoggerFactory.getLogger(TesseractOcrServiceImpl.class);

    private final Tesseract tesseract;

    public TesseractOcrServiceImpl(Tesseract tesseract) {
        this.tesseract = tesseract;
    }

    @Override
    public OcrResponseDTO recognizeText(InputStream inputStream) throws IOException {
        BufferedImage originalImage = ImageIO.read(inputStream);
        if (originalImage == null) {
            throw new ResourceNotFoundException("Could not read the image. Please upload a valid JPEG or PNG file.");
        }

        BufferedImage processedImage = preprocessImage(originalImage);
        try {
            String fullText = tesseract.doOCR(processedImage);
            logger.debug("[OCR] Extracted text: {}", fullText);
            return parseReceipt(fullText);
        } catch (TesseractException e) {
            logger.error("[OCR] Tesseract failed to process image", e);
            throw new RuntimeException("OCR processing failed. Please try a clearer image.");
        }
    }

    private BufferedImage preprocessImage(BufferedImage image) {
        BufferedImage gray = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_BYTE_GRAY);
        Graphics2D g = gray.createGraphics();
        g.drawImage(image, 0, 0, null);
        g.dispose();

        int newWidth = image.getWidth() * 2;
        int newHeight = image.getHeight() * 2;
        Image scaled = gray.getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH);
        BufferedImage output = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_BYTE_GRAY);
        Graphics2D g2 = output.createGraphics();
        g2.drawImage(scaled, 0, 0, null);
        g2.dispose();

        return output;
    }

    private OcrResponseDTO parseReceipt(String text) {
        String cif = findPattern(text, "(?:RO|CUI|CIF)[^\\d]*(\\d{6,10})", 1);
        String date = findPattern(text, "(\\d{2}[.,\\-/]\\s*\\d{2}[.,\\-/]\\s*\\d{4})", 1);
        String receiptNumber = findPattern(text, "(?:BON\\s*NR|NUMAR\\s*TRANZACTIE|NR\\.?\\s*BON)[^\\d]*(\\S+)", 1);

        String upper = text.toUpperCase();
        String fuelType = null;
        if (upper.contains("MOTORINA") || upper.contains("DIESEL")) {
            fuelType = "DIESEL";
        } else if (upper.contains("BENZINA") || upper.contains("COR 95")) {
            fuelType = "GASOLINE";
        }

        int formBoundary = upper.indexOf("NUME SAU COD FISCAL");
        String receiptText = formBoundary > 0 ? upper.substring(0, formBoundary) : upper;
        String paymentMethod = receiptText.contains("CARD") ? "CARD" : "CASH";

        String total = findPattern(text, "TOTAL[^\\d]*(\\d+[.,]\\s*\\d{2})(?:\\s*A)?", 1);

        return new OcrResponseDTO(cif, date, receiptNumber, fuelType, paymentMethod, total);
    }

    private String findPattern(String text, String regex, int group) {
        Matcher matcher = Pattern.compile(regex).matcher(text);
        return matcher.find() ? matcher.group(group) : null;
    }
}
