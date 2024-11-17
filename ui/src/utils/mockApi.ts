// This is a mock API response for testing the UI
export const mockApiResponse = async (prompt: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
  
    // Return a sample HTML response
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Generated Website</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
          .hero { background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80'); background-size: cover; color: white; padding: 100px 0; }
      </style>
  </head>
  <body>
      <section class="hero text-center">
          <div class="container">
              <h1 class="display-4">Welcome to Our Coffee Shop</h1>
              <p class="lead">Serving the finest artisanal coffee since 1990</p>
          </div>
      </section>
  
      <section class="py-5">
          <div class="container">
              <h2 class="text-center mb-4">Our Menu</h2>
              <div class="row">
                  <div class="col-md-4 mb-4">
                      <div class="card">
                          <div class="card-body">
                              <h5 class="card-title">Espresso</h5>
                              <p class="card-text">Rich and bold espresso shot</p>
                              <p class="card-text"><small class="text-muted">$3.50</small></p>
                          </div>
                      </div>
                  </div>
                  <!-- More menu items would go here -->
              </div>
          </div>
      </section>
  
      <section class="bg-light py-5">
          <div class="container">
              <h2 class="text-center mb-4">Contact Us</h2>
              <div class="row justify-content-center">
                  <div class="col-md-6">
                      <form>
                          <div class="mb-3">
                              <input type="email" class="form-control" placeholder="Your Email">
                          </div>
                          <div class="mb-3">
                              <textarea class="form-control" rows="3" placeholder="Your Message"></textarea>
                          </div>
                          <button type="submit" class="btn btn-primary">Send Message</button>
                      </form>
                  </div>
              </div>
          </div>
      </section>
  </body>
  </html>
    `;
  };