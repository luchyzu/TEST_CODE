FROM registry.cn-hangzhou.aliyuncs.com/notip-com-cn/node:latest-browsers as builder

WORKDIR /usr/src/app/
USER root
COPY ../package.json ./
RUN yarn config set registry https://registry.npm.taobao.org \
    && yarn
COPY ../ ./
RUN yarn build \
    && mkdir -p dist/static \
    && mkdir -p dist/download \
    && zip -r dist/download/build.zip dist

FROM registry.cn-hangzhou.aliyuncs.com/notip-com-cn/nginx:1.19-alpine

# 替换国内源,设置时区为上海
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories \
    && apk add tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata
   
WORKDIR /html

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /usr/src/app/dist /html
RUN date "+%Y-%m-%d %H:%M:%S" > static/version \
    && mv download/build.zip download/build-$(date "+%Y%m%d%H%M%S").zip 
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]