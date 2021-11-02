// import "core-js/modules/es.object.entries";

(() => {
  class BaseIframe {
    constructor(className, version, callBack) {
      this.className = className;
      this.callBack = callBack;
      this.iframeheight = 0;
      this.hostUrl = "";
      this.openAlert = true; // 默认开启
      this.iframeClass = `klook_iframe_${new Date().getMilliseconds()}`;
      this.initSuccessStatus = { [this.iframeClass]: false };
      this.init();
      this.dataset = {};
      this.larkUrl =
        "https://open.larksuite.com/open-apis/bot/v2/hook/5590a6ef-133d-4d69-a110-e8a325914e53";
    }

    //回调函数
    message(event) {
      if (event.data.type === `${this.prod}_success`) {
        this.initSuccessStatus[this.iframeClass] = true;
      }
    }

    logFormat(log) {
      return {
        href: window.location.href,
        referer: window.document.referrer,
        agent: window.navigator.userAgent,
        ...log,
      };
    }

    init() {
      // 获取页面属性值
      const elements = document.querySelectorAll(this.className);
      elements.forEach((element, index) => {
        // 记录初始化失败
        const obj = (element && element.dataset) || {};
        // 设置高度
        const attrObj = (this.callBack && this.callBack(obj, element)) || obj;
        this.dataset = attrObj;
        elements[index].innerHTML = this.renderTemplate(attrObj);
      });
      this.shouldMonitor() && this.addListener();
      this.fun = this.message.bind(this);
      this.shouldMonitor() &&
        window.addEventListener("message", this.fun, false);
    }

    shouldMonitor() {
      return (
        this.openAlert &&
        `${window.location.protocol}//${window.location.host}` !== this.hostUrl
      );
    }

    checkIframeInitSuccess(prod, success, error) {
      // 10S 后检查状态, 如果页面上存在多个同种类型的ads, 只会检测最后一次是否成功和失败
      setTimeout(() => {
        // 移除事件
        // 检查所有的 initSuccessArr
        const initSuccess = this.initSuccessStatus[this.iframeClass];
        // 移除事件
        window.removeEventListener("message", this.fun, false);
        if (initSuccess) {
          console.info(`${prod}, ${this.iframeClass} ,初始化成功`);
          success && success(prod);
        } else {
          console.warn(`${prod}, ${this.iframeClass} ,初始化失败`);
          error && error(prod);
          this.sendErrorMessage();
        }
      }, 10000);
    }

    getInformation(element) {
      // 当前页面 url
      const url = window.location.href;
      // 页面中同类型第几个 iframe
      // iframe 宽, 高容器位置
      // 广告是否被进入视图口, 监听
      const { clientHeight, clientWidth } = element;
      return {
        url,
        size: {
          clientWidth, // 元素宽
          clientHeight, // 元素高
        },
        // 绝对位置
        position: {
          x:
            element.getBoundingClientRect().left +
            document.documentElement.scrollLeft,
          y:
            element.getBoundingClientRect().top +
            document.documentElement.scrollTop,
        },
      };
    }

    getType(obj) {
      return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    }

    formatObj(obj) {
      return JSON.stringify(obj, null, 2);
    }

    // iframe 加载失败, 上报接口到 node 接口
    sendErrorMessage() {
      // 定义上报接口
      const errorObj = {
        level: "E",
        type: "iframe_err",
        err_msg: "iframe script error",
        prod: this.prod,
        dataset: this.dataset,
      };
      const data = this.logFormat(errorObj);
      const attachments = Object.keys(data).map((key) => {
        return [
          {
            tag: "text",
            text: `${key.replace(/^\S/, (s) => s.toUpperCase())} : ${
              this.getType(data[key]) === "object"
                ? this.formatObj(data[key])
                : data[key]
            }`,
          },
        ];
      });
      const postData = {
        msg_type: "post",
        content: {
          post: {
            zh_cn: {
              title: "affiliate错误提醒",
              content: attachments,
            },
          },
        },
      };
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${this.larkUrl}`);
      xhr.withCredentials = true;
      xhr.send(JSON.stringify(postData));
    }

    addListener() {
      // iframe 成功/失败都会调用 onload 事件
      const ele = document.querySelector(`.${this.iframeClass}`);
      if (ele) {
        ele.onload = () => {
          if (ele.contentWindow && ele.contentWindow.postMessage) {
            // 统计当前页面数据, 方便 affiliate 分析
            ele.contentWindow.postMessage(
              {
                type: `${this.prod}_onload`,
                content: {
                  index: this.iframeClass,
                  ...this.getInformation(ele),
                },
              },
              this.hostUrl
            );
            // 过 10S 判断一下同类型广告最后一个是否渲染成功
            this.checkIframeInitSuccess(this.prod);
          }
        };
      }
    }

    renderTemplate(attrObj) {
      if (attrObj.open_alert) {
        this.openAlert = attrObj.open_alert;
      }
      this.prod = attrObj.prod;
      const url = `/v1/affnode/render`;
      const src = `${this.host(attrObj.host)}${url}`;
      const query = Object.entries(attrObj)
        .map((item) => {
          let key = item[0];
          let value = item[1];
          if (key !== "host") {
            return `${key}=${encodeURIComponent(value.trim())}`;
          }
        })
        .join("&");
      return `<iframe src=${src}?${query}
                            class=${this.iframeClass}
                            style=${this.iframeStyle(
                              attrObj.width || "100%",
                              attrObj.height || "100%"
                            )}
                            marginheight="0"
                            marginwidth="0"
                            frameborder="0"
                            allowtransparency="true"
                            title="Klook.com third party widget. Discover and book amazing things to do at exclusive prices. Links open in an external site that may or may not meet accessibility guidelines."
                        >
                </iframe>`;
    }

    host(dataHost) {
      // 由于脚本可单独使用, 开发/测试 通过显式ins标签属性传入；产线不传走 affiliate 产线域名
      this.hostUrl = dataHost || "https://affiliate.klook.com";
      return dataHost ? dataHost : "https://affiliate.klook.com";
    }

    iframeStyle(width, height) {
      return `border:none;padding:0;margin:0;overflow:hidden;max-width:none;width:${width};height:${height}`;
    }
  }

  class StaticBanner extends BaseIframe {
    constructor(className, version, callback) {
      super(className, version, callback);
    }
  }

  new StaticBanner(".static_banner", 3);
})();
