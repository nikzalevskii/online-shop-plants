import {Component, Input, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  cart: CartType | null = null;
  products: FavoriteType[] = [];
  serverStaticPath: string = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    forkJoin([this.favoriteService.getFavorites(), this.cartService.getCart()])
      .subscribe(([favorites, cart]: [FavoriteType[] | DefaultResponseType, CartType | DefaultResponseType]) => {
        if ((favorites as DefaultResponseType).error !== undefined) {
          throw new Error((favorites as DefaultResponseType).message);
        }
        if ((cart as DefaultResponseType).error !== undefined) {
          throw new Error((cart as DefaultResponseType).message);
        }
        this.products = favorites as FavoriteType[];
        this.cart = cart as CartType;
        this.products.forEach((favoriteItem: FavoriteType) => {
          const cartItem = this.cart?.items.find(item => item.product.id === favoriteItem.id);
          favoriteItem.count = cartItem ? cartItem.quantity : 1;
          favoriteItem.countInCart = cartItem ? cartItem.quantity : 0;
        })
      })
  }

  isInCart(productId: string): boolean {
    const result = this.cart?.items.find(item => item.product.id === productId);
    return !!result;
  }

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }
        this.products = this.products.filter((item: FavoriteType) => item.id !== id);
      })
  }

  addFavoriteIneCart(productId: string, value: number) {
    const product:FavoriteType | undefined = this.products.find(product => product.id === productId);
    if (!product) return;
    product.count = value;
    if (!this.isInCart(productId)) {
      this.cartService.updateCart(productId, value)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          product.countInCart = value;
          this.loadData();
        });
    }
  }

  updateCount(value: number, productId: string) {
    const product = this.products.find(product => product.id === productId);
    if (!product) return;
    product.count = value;

    if (this.isInCart(productId)) {
      this.cartService.updateCart(productId, value)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          product.countInCart = value;
          this.isInCart(productId);
        });
      // this.loadFavorites();
      // this.loadCart();
    }


  }

}
