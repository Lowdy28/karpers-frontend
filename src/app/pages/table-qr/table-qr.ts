import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as QRCode from 'qrcode';

interface TableQrCode {
  tableNumber: number;
  dataUrl: string;
}

@Component({
  selector: 'app-table-qr',
  imports: [CommonModule],
  templateUrl: './table-qr.html',
  styleUrl: './table-qr.css',
})
export class TableQr {
  totalTables = 10;
  qrCodes = signal<TableQrCode[]>([]);

  constructor() {
    this.generateAll();
  }

  async generateAll(): Promise<void> {
    const codes: TableQrCode[] = [];

    for (let i = 1; i <= this.totalTables; i++) {
      const url = `http://localhost:4200/?mesa=${i}`;
      const dataUrl = await QRCode.toDataURL(url, { width: 300 });
      codes.push({ tableNumber: i, dataUrl });
    }

    this.qrCodes.set(codes);
  }

  download(code: TableQrCode): void {
    const link = document.createElement('a');
    link.href = code.dataUrl;
    link.download = `mesa-${code.tableNumber}.png`;
    link.click();
  }
}
