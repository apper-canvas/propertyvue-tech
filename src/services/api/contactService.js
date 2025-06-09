// Local delay utility to avoid circular dependencies
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const contactService = {
  async sendContactForm(contactData) {
    await delay(800); // Simulate network request
    
    // Simulate random failures (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Failed to send message');
    }

    // Mock email sending logic
    const emailData = {
      to: contactData.agentEmail,
      subject: `New inquiry for ${contactData.propertyTitle}`,
      body: `
        New property inquiry received:
        
        Property: ${contactData.propertyTitle}
        Reference: ${contactData.propertyRef}
        Price: ${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0
        }).format(contactData.propertyPrice)}
        
        Contact Information:
        Name: ${contactData.name}
        Phone: ${contactData.phone}
        Email: ${contactData.email}
        
        Message:
        ${contactData.message || 'No additional message provided.'}
        
        Please respond to this inquiry promptly.
      `,
      timestamp: new Date().toISOString(),
      contactId: Date.now().toString()
    };

    // In a real application, this would make an API call
    console.log('Sending email to agent:', emailData);
    
    return {
      success: true,
      contactId: emailData.contactId,
      message: 'Contact form submitted successfully'
    };
  },

  async getContactHistory(propertyId) {
    await delay(300);
    
    // Mock contact history (in real app, this would come from database)
    return [
      {
        id: '1',
        propertyId,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        message: 'Interested in scheduling a viewing',
        sentDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: 'responded'
      },
      {
        id: '2',
        propertyId,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '(555) 987-6543',
        message: 'Can you provide more details about the neighborhood?',
        sentDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        status: 'pending'
      }
    ];
  }
};

export default contactService;
export { contactService };