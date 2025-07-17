# Path to the directory containing HTML files
$directory = "."

# Read the schema template
$template = Get-Content -Path ".\schema-template.json" -Raw

# Get all HTML files except index.html
$files = Get-ChildItem -Path $directory -Filter "*.html" | Where-Object { $_.Name -ne "index.html" }

foreach ($file in $files) {
    Write-Host "Updating schema in $($file.Name)..."
    
    # Read the file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Create a page-specific schema
    $pageSchema = $template -replace '"url":\s*"[^"]*"', ('"url": "https://srivinayagatextiles.in/' + $file.Name.ToLower() + '"')
    
    # Customize description based on page
    switch -Wildcard ($file.Name.ToLower()) {
        "about.html" { 
            $pageSchema = $pageSchema -replace '"description":\s*"[^"]*"', '"description": "Learn about Sri Vinayaga Textiles, a leading textile manufacturer in Tirupur, India with over 20 years of experience in producing high-quality yarns and fabrics."'
        }
        "products.html" { 
            $pageSchema = $pageSchema -replace '"description":\s*"[^"]*"', '"description": "Explore our wide range of high-quality yarns and fabrics. Sri Vinayaga Textiles offers premium textile solutions for various industries."'
        }
        "contact.html" { 
            $pageSchema = $pageSchema -replace '"description":\s*"[^"]*"', '"description": "Contact Sri Vinayaga Textiles for inquiries about our yarn and fabric products. We are here to assist you with your textile needs."'
        }
        "yarn-products.html" { 
            $pageSchema = $pageSchema -replace '"description":\s*"[^"]*"', '"description": "Discover our premium yarn products including cotton, polyester, and blended yarns. High quality yarns for all your textile needs."'
        }
        "woven-fabrics.html" { 
            $pageSchema = $pageSchema -replace '"description":\s*"[^"]*"', '"description": "Explore our collection of high-quality woven fabrics. Perfect for fashion, home textiles, and industrial applications."'
        }
        "hosiery-fabrics.html" { 
            $pageSchema = $pageSchema -replace '"description":\s*"[^"]*"', '"description": "Premium hosiery fabrics for comfortable and durable clothing. Browse our collection of high-quality hosiery materials."'
        }
        "hosiery-special-blend-fabrics.html" { 
            $pageSchema = $pageSchema -replace '"description":\s*"[^"]*"', '"description": "Special blend hosiery fabrics combining the best properties of different fibers for superior comfort and performance."'
        }
    }
    
    # Remove existing schema if present
    $content = $content -replace '<script\s+type="application/ld\+json">[\s\S]*?</script>', ''
    
    # Add the new schema before the closing </body> tag
    $newContent = $content -replace '</body>', "<script type=`"application/ld+json`">$pageSchema</script>`n</body>"
    
    # Save the updated content
    Set-Content -Path $file.FullName -Value $newContent -NoNewline
}

Write-Host "Schema updates complete!"
