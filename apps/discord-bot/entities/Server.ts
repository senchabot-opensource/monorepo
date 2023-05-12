import { Entity, Column } from "typeorm";
@Entity()
export default class Server {
    @Column({ unique: true, name: "server_id" })
    serverId!: string;

    @Column({ name: "server_name" })
    serverName!: string;

    @Column({ name: "server_owner" })
    serverOwner!: string;
}
