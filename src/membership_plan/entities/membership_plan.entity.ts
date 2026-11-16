import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subscription } from "../../subscription/entities/subscription.entity";

@Entity('membership_plans')
export class MembershipPlan {

    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    name: string; 

    @Column({ type: 'text'})
    description: string; 

    @Column({type: 'decimal', precision: 10, scale: 2}) //para pasar varios valores para nuestra columna usamos curly braces {}
    price: number; 

    @Column({ name: 'duration_days', type: 'int' })
    durationDays: number; 

    @OneToMany(() => Subscription, (subscription) => subscription.membershipPlan)
    subscriptions: Subscription[]; 
}
