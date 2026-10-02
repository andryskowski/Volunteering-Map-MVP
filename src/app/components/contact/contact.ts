import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalService } from '../../services/modal-service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./contact.scss'],
})
export class Contact implements OnInit {
  contactForm!: FormGroup;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: [
        this.currentUser?.userInfo?.name || '',
        Validators.required,
      ],
      email: [
        this.currentUser?.userInfo?.email || '',
        [Validators.required, Validators.email],
      ],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  sendEmail(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.modalService.open(
      'Demo Application',
      'This is a demo application. Your message has not been sent.'
    );

    this.contactForm.reset({
      name: this.currentUser?.userInfo?.name || '',
      email: this.currentUser?.userInfo?.email || '',
      subject: '',
      message: '',
    });
  }
}