export function Contact() {
  return (
    <div className="relative z-10 min-h-screen pt-48 md:pt-56 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sentient font-bold mb-6 leading-tight">
            Get in <i className="font-light">Touch</i>
          </h1>
          <p className="font-mono text-foreground/80 text-lg leading-relaxed font-semibold max-w-2xl mx-auto">
            Questions, comments, or interested in working with us? We'd love to hear from you.
          </p>
        </div>

        <div className="max-w-2xl mx-auto text-center space-y-12">
          {/* Contact Information */}
          <div className="bg-background/60 backdrop-blur-sm border border-border rounded-lg p-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-sentient font-semibold mb-4 text-foreground">Email Us</h3>
                <a 
                  href="mailto:evangruhlkey@tamu.edu" 
                  className="text-2xl md:text-3xl font-mono text-primary hover:text-primary/80 transition-colors"
                >
                  evangruhlkey@tamu.edu
                </a>
              </div>

              <div className="pt-8 border-t border-border/30">
                <h3 className="text-xl font-sentient font-semibold mb-4 text-foreground">What We're Looking For</h3>
                <div className="font-mono text-sm text-foreground/70 leading-relaxed space-y-2">
                  <p>• General questions and feedback</p>
                  <p>• Partnership opportunities</p>
                  <p>• Business inquiries</p>
                  <p>• Media and press requests</p>
                </div>
              </div>

           
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

