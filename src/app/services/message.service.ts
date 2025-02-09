import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public masterErrorMessages: string[] = [];

  constructor() { };

  add(errorMessage: string): void {
    this.masterErrorMessages.push(errorMessage);
  };

  clear(): void {
    this.masterErrorMessages = [];
  };
};
