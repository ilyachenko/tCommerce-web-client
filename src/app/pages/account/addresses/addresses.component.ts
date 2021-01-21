import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '../../../services/customer/customer.service';
import { ShipmentAddressDto } from '../../../shared/dtos/shipment-address.dto';
import { DEFAULT_ERROR_TEXT } from '../../../shared/constants';
import { finalize } from 'rxjs/operators';
import { HeadService } from '../../../services/head/head.service';
import { AddressTypeEnum } from '../../../shared/enums/address-type.enum';
import { AddressFormComponent } from '../../../address-form/address-form.component';
import { LanguageService } from '../../../services/language/language.service';

@Component({
  selector: 'addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {

  formError: string;
  formSuccess: string | null = null;
  isLoading: boolean = false;
  addressTypes = AddressTypeEnum;
  activeAddress: ShipmentAddressDto;
  private newAddress: ShipmentAddressDto = new ShipmentAddressDto();

  get addresses() { return this.customerService.customer.addresses; }

  @ViewChild(AddressFormComponent) addressFormCmp: AddressFormComponent;

  constructor(
    private customerService: CustomerService,
    private headService: HeadService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.setMeta();
  }

  submitForm() {
    this.formError = null;
    if (!this.addressFormCmp.checkValidity()) { return; }

    const formValue: ShipmentAddressDto = this.addressFormCmp.getValue();
    this.activeAddress === this.newAddress ? this.addAddress(formValue) : this.editAddress(formValue);
  }

  openAddressForm(address?: ShipmentAddressDto) {
    if (!address) {
      this.activeAddress = this.newAddress;
    } else {
      this.activeAddress = address;
    }
  }

  private addAddress(dto: ShipmentAddressDto) {
    this.isLoading = true;
    this.customerService.addShippingAddress(dto)
      .pipe( finalize(() => this.isLoading = false) )
      .subscribe(
        _ => {
          this.showSuccessMessage(`addresses.address_added`);
          this.closeForm();
        },
        error => {
          this.showErrorMessage(error);
        }
      );
  }

  private editAddress(dto: ShipmentAddressDto) {
    this.isLoading = true;
    this.customerService.editShippingAddress(dto.id, dto)
      .pipe( finalize(() => this.isLoading = false) )
      .subscribe(
        _ => {
          this.showSuccessMessage(`addresses.address_edit`);
          this.closeForm();
        },
        error => {
          this.showErrorMessage(error);
        }
      );
  }

  closeForm() {
    this.activeAddress = null;
    this.formError = null;
  }

  private showSuccessMessage(msgKey: string) {
    this.languageService.getTranslation(msgKey).subscribe(text => {
      this.formSuccess = text;
      setTimeout(() => this.formSuccess = null, 5000);
    });
  }

  private showErrorMessage(error: any) {
    this.formError = error.error?.message || DEFAULT_ERROR_TEXT;
    console.warn(error);
  }

  private setMeta() {
    this.languageService.getTranslation('addresses.my_addresses').subscribe(text => {
      this.headService.setMeta({ title: text, description: text });
    });
  }
}
