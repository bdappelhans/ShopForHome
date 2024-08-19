import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product';
import { OrderService } from '../service/order.service';
import { Order } from '../model/order';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-sales-report',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, RouterModule, FormsModule],
  providers: [ProductService, OrderService, DatePipe],
  templateUrl: './admin-sales-report.component.html',
  styleUrls: ['./admin-sales-report.component.css']
})
export class AdminSalesComponent implements OnInit {

  startDate!: Date;
  endDate!: Date;
  orders: Order[] = [];
  noOrders!: number;
  totalRevenue!: number;
  totalDiscount!: number;
  formattedStartDate!: string | null;
  formattedEndDAte!: string | null;

  constructor(private productService: ProductService, private orderService: OrderService, private router: Router, private datePipe: DatePipe) {}

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.startDate && this.endDate) {
      console.log(this.startDate);
      console.log(this.endDate);
      this.orderService.getOrdersByDateRange(this.startDate, this.endDate).subscribe(
        (orders: Order[]) => {
          console.log('Filtered Orders:', orders);
          this.orders = orders;
          this.generateReport();
        },
        (error) => {
          console.error('Error fetching orders:', error);
        }
      );
    }
  }

  generateReport(): void {
    if (this.orders.length > 0) {
      this.noOrders = this.orders.length;
    
      let totalRevenue = 0;
      let totalDiscount = 0;

      for (const order of this.orders) {
        totalRevenue += order.finalTotal;
        totalDiscount += order.discount;
      }

      this.totalRevenue = totalRevenue;
      this.totalDiscount = totalDiscount;
    }
    this.formattedStartDate = this.formatDate(this.startDate);
    this.formattedEndDAte = this.formatDate(this.endDate);
  }

  formatDate(date: Date | string) {
    return this.datePipe.transform(date, 'MM/dd/yyyy');
  }

}
