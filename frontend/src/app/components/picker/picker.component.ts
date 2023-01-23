import { Component, OnInit } from '@angular/core';
import { Color } from '../../Color';
import { Model, RGB } from '../../Model';
import { PrimitiveType } from '../../PrimitiveType';
import { ColorsService } from '../../services/colors/colors.service';

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.css']
})
export class PickerComponent implements OnInit {
  models!: Model[];
  picked_color!: Color;
  picked_model!: Model;

  constructor(private colors: ColorsService) { }

  ngOnInit(): void {
    this.picked_color = this.colors.loadColor('picked_color');
    this.picked_model = this.picked_color.hsl;
    this.models = this.picked_color.models.filter(el => el.name !== 'hex');
  }

  representColor(): string {
    this.picked_color.update(this.picked_model);
    this.colors.saveColor('picked_color', this.picked_color);
    return `hsl(${this.picked_color.hsl.toString()})`;
  }

  invertColor(): void {
    this.picked_color = this.picked_color.invert();
  }

  getInvertedColor(): string {
    let model = this.picked_color.semiInvert().hsl;
    return `hsl(${model.toString()})`;
  }

  getField(model: Model, name: string): PrimitiveType {
    let value = model[name as keyof Model] as PrimitiveType;
    return value as PrimitiveType;
  }

  getModelsOrder(): Model[] {
    let order = this.picked_color.models;
    let selected = this.picked_model;
    let i;
    for (i = 0; i < order.length; i++) {
      if (order[i].name == selected.name) {
        break;
      }
    }
    order.splice(i, 1);
    order.unshift(selected);

    return order;
  }
}
