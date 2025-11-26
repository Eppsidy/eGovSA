package org.itmda.egovsabackend.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class StorageService {
    
    @Value("${supabase.url}")
    private String supabaseUrl;
    
    @Value("${supabase.key}")
    private String supabaseKey;
    
    @Value("${supabase.storage.bucket}")
    private String bucketName;
    
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    
    public StorageService() {
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Generate a signed URL for downloading a file from Supabase Storage
     * @param filePath The path of the file in the storage bucket
     * @param expiresIn Expiration time in seconds (default 3600 = 1 hour)
     * @return Signed URL for downloading the file
     */
    public String getSignedUrl(String filePath, int expiresIn) {
        try {
            // Extract file path from full URL if needed
            String actualFilePath = extractFilePath(filePath);
            
            // Build the signed URL endpoint
            String endpoint = String.format("%s/storage/v1/object/sign/%s/%s", 
                supabaseUrl, bucketName, actualFilePath);
            
            // Create request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("expiresIn", expiresIn);
            
            String jsonBody = objectMapper.writeValueAsString(requestBody);
            
            // Build HTTP request
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + supabaseKey)
                .header("apikey", supabaseKey)
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();
            
            // Send request
            HttpResponse<String> response = httpClient.send(request, 
                HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() == 200) {
                // Parse response to get signed URL
                @SuppressWarnings("unchecked")
                Map<String, String> responseMap = objectMapper.readValue(
                    response.body(), Map.class);
                String signedUrl = responseMap.get("signedURL");
                
                // Return full URL
                return supabaseUrl + signedUrl;
            } else {
                throw new RuntimeException("Failed to generate signed URL: " + response.body());
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Error generating signed URL for file: " + filePath, e);
        }
    }
    
    /**
     * Generate a signed URL with default expiration (1 hour)
     */
    public String getSignedUrl(String filePath) {
        return getSignedUrl(filePath, 3600);
    }
    
    /**
     * Get public URL for a file (no signature required for public buckets)
     */
    public String getPublicUrl(String filePath) {
        String actualFilePath = extractFilePath(filePath);
        return String.format("%s/storage/v1/object/public/%s/%s", 
            supabaseUrl, bucketName, actualFilePath);
    }
    
    /**
     * Extract file path from full Supabase URL
     * Example: https://buqqhpqxldqhiazpluvb.supabase.co/storage/v1/object/public/application-documents/file.pdf
     * Returns: file.pdf
     */
    private String extractFilePath(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            throw new IllegalArgumentException("File URL cannot be empty");
        }
        
        // If it's already a path (no http), return as is
        if (!fileUrl.startsWith("http")) {
            return fileUrl;
        }
        
        // Extract path from URL
        try {
            String[] parts = fileUrl.split("/storage/v1/object/");
            if (parts.length > 1) {
                String pathPart = parts[1];
                // Remove 'public/' or 'sign/' prefix if present
                pathPart = pathPart.replaceFirst("^(public|sign)/", "");
                // Remove bucket name prefix
                pathPart = pathPart.replaceFirst("^" + bucketName + "/", "");
                return pathPart;
            }
            
            // If URL structure is different, try to extract filename from end
            String[] urlParts = fileUrl.split("/");
            return urlParts[urlParts.length - 1];
            
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid Supabase storage URL: " + fileUrl, e);
        }
    }
}
