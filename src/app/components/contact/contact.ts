import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FormData {
  name: string;
  email: string;
  subject: string;
  project: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  formData: FormData = {
    name: '',
    email: '',
    subject: '',
    project: '',
    message: ''
  };

  isSubmitting = false;
  submitMessage = '';
  submitStatus: 'success' | 'error' = 'success';

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.submitMessage = '';

    // Simulate form submission
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitStatus = 'success';
      this.submitMessage = 'Votre message a été envoyé avec succès ! Je vous répondrai dans les plus brefs délais.';
      
      // Reset form
      this.formData = {
        name: '',
        email: '',
        subject: '',
        project: '',
        message: ''
      };

      // Clear message after 5 seconds
      setTimeout(() => {
        this.submitMessage = '';
      }, 5000);
    }, 2000);
  }

  private validateForm(): boolean {
    if (!this.formData.name.trim()) {
      this.showError('Veuillez saisir votre nom.');
      return false;
    }

    if (!this.formData.email.trim()) {
      this.showError('Veuillez saisir votre email.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      this.showError('Veuillez saisir une adresse email valide.');
      return false;
    }

    if (!this.formData.subject.trim()) {
      this.showError('Veuillez saisir le sujet de votre message.');
      return false;
    }

    if (!this.formData.message.trim()) {
      this.showError('Veuillez saisir votre message.');
      return false;
    }

    return true;
  }

  private showError(message: string): void {
    this.submitStatus = 'error';
    this.submitMessage = message;
    setTimeout(() => {
      this.submitMessage = '';
    }, 3000);
  }
}
