export type XtreamCreds = {
  host: string;     // ex: http://servidor:8080  (sem / no fim)
  username: string;
  password: string;
  output: "m3u8" | "ts"; // formato preferido para URL de playback
};

export type LiveCategory = {
  category_id: string;
  category_name: string;
  parent_id?: number;
};

export type LiveStream = {
  stream_id: number;
  name: string;
  stream_icon?: string;
  category_id?: string;
  tv_archive?: number;
  added?: string;
};

export type XtreamHandshake = {
  user_info?: any;
  server_info?: any;
};
