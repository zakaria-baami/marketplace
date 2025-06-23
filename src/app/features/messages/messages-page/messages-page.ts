import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBadgeModule } from '@angular/material/badge';
import { HeaderComponent } from '../../../shared/components/header/header';

@Component({
  selector: 'app-messages-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatBadgeModule,
    HeaderComponent
  ],
  templateUrl: './messages-page.html',
  styleUrls: ['./messages-page.css']
})
export class MessagesPageComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  conversations: any[] = [];
  selectedConversation: any = null;
  newMessage = '';

  constructor() {}

  ngOnInit() {
    this.loadConversations();
    if (this.conversations.length > 0) {
      this.selectConversation(this.conversations[0]);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadConversations() {
    // Mock conversations data - replace with service call
    this.conversations = [
      {
        id: 1,
        partner: {
          name: 'Marie Créations',
          avatar: 'MC',
          isOnline: true
        },
        lastMessage: 'Bonjour ! Avez-vous des questions sur votre commande ?',
        timestamp: '10:30 AM',
        unreadCount: 2,
        messages: [
          { sender: 'partner', text: 'Bonjour !', time: '10:28 AM' },
          { sender: 'partner', text: 'Avez-vous des questions sur votre commande ?', time: '10:30 AM' },
          { sender: 'me', text: 'Bonjour, non tout est parfait, merci !', time: '10:32 AM' }
        ]
      },
      {
        id: 2,
        partner: {
          name: 'Atelier Poterie',
          avatar: 'AP',
          isOnline: false
        },
        lastMessage: 'Merci pour votre achat !',
        timestamp: 'Yesterday',
        unreadCount: 0,
        messages: [
          { sender: 'partner', text: 'Votre commande a été expédiée.', time: 'Yesterday' },
          { sender: 'partner', text: 'Merci pour votre achat !', time: 'Yesterday' },
          { sender: 'me', text: 'Super, merci beaucoup !', time: 'Yesterday' }
        ]
      },
      {
        id: 3,
        partner: {
          name: 'Vintage Style',
          avatar: 'VS',
          isOnline: true
        },
        lastMessage: 'Je vous en prie !',
        timestamp: 'Monday',
        unreadCount: 0,
        messages: [
          { sender: 'me', text: 'J\'adore le sac, il est magnifique !', time: 'Monday' },
          { sender: 'partner', text: 'Merci beaucoup !', time: 'Monday' },
          { sender: 'partner', text: 'Je vous en prie !', time: 'Monday' }
        ]
      }
    ];
  }

  selectConversation(conversation: any) {
    if (this.selectedConversation) {
      this.selectedConversation.unreadCount = 0;
    }
    this.selectedConversation = conversation;
    this.selectedConversation.unreadCount = 0; // Mark as read
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedConversation) {
      this.selectedConversation.messages.push({
        sender: 'me',
        text: this.newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.selectedConversation.lastMessage = this.newMessage;
      this.newMessage = '';
    }
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
} 