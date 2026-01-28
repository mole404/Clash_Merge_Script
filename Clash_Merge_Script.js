// Clash Merge Script - 全局覆写脚本

function main(params) {
    params.proxies = Array.isArray(params.proxies) ? params.proxies : [];
    overwriteBasicOptions(params);
    overwriteDns(params);
    overwriteProxyGroups(params);
    overwriteRules(params);
    return params;
}

// 覆写核心设置
function overwriteBasicOptions(params) {
    const otherOptions = {
        "mixed-port": 7890,
        "allow-lan": false,
        "mode": "rule",
        "log-level": "info",
        "ipv6": true,
        "find-process-mode": "strict",
        "rule-anchor": "",
        "profile": {
          "store-selected": true
        },
        "unified-delay": true,

        "external-controller": "",
        "secret": "Redzone05",
        "external-controller-cors": {
          "allow-private-network": true
        },

        "tun": {
          "enable": true,
          "stack": "system",
          "auto-route": true,
          "strict-route": false,
          "auto-detect-interface": true,
          "dns-hijack": ["any:53"]
        },

        "sniffer": {
          "enable": true,
          "force-dns-mapping": true,
          "parse-pure-ip": true,
          "override-destination": true
        }
    };

    Object.assign(params, otherOptions);
}

// 覆写DNS
function overwriteDns(params) {
    const dnsOptions = {
      "enable": true,
      "ipv6": true,
      "prefer-h3": true,
      "ipv6-timeout": 300,
      "listen": ":53",
      "respect-rules": false,
      "use-hosts": false,
      "use-system-hosts": false,
      "cache-algorithm": "arc",
      "default-nameserver": ["tls://223.5.5.5:853", "tls://119.29.29.29:853", "tls://8.8.8.8:853"],
      "direct-nameserver": [],
      "direct-nameserver-follow-policy": false,
      "nameserver": ["https://dns.alidns.com/dns-query", "https://doh.pub/dns-query", "https://dns.google/dns-query", "tls://223.5.5.5:853", "tls://119.29.29.29:853", "tls://8.8.8.8:853"],
      "nameserver-policy": {
        "+.qq.com": ["https://doh.pub/dns-query", "tls://119.29.29.29:853"],
        "+.tencent.com": ["https://doh.pub/dns-query", "tls://119.29.29.29:853"],
        "+.weixin.com": ["https://doh.pub/dns-query", "tls://119.29.29.29:853"]
      },
      "enhanced-mode": "fake-ip",
      "fake-ip-range": "198.18.0.1/16",
      "fake-ip-filter-mode": "blacklist",
      "fake-ip-filter": [
        "+.lan",
        "+.local",
        "+.arpa",
        "time.*.com",
        "ntp.*.com",
        "+.market.xiaomi.com",
        "localhost.ptlogin2.qq.com",
        "+.msftncsi.com",
        "www.msftconnecttest.com"
      ],
      "fallback": [],
      "fallback-filter": {
        "domain": ["+.google.com", "+.facebook.com", "+.youtube.com"],
        "geoip": true,
        "geoip-code": "CN",
        "ipcidr": ["240.0.0.0/4", "0.0.0.0/32"]
      }
    };
    params.dns = dnsOptions;
}

// 覆写代理组
function overwriteProxyGroups(params) {
    // 从 params.proxies 中收集所有订阅节点的名字（如果存在）
    const allProxyNames = Array.isArray(params.proxies) ? params.proxies.map(p => p.name).filter(Boolean) : [];

    const manualProxyGroups = [
        {
            name: "PROXY",
            type: "select",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            timeout: 3000,
            "include-all": true
        },
        {
            name: "Twitter",
            type: "select",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            timeout: 3000,
            proxies: ["PROXY"],
            "include-all": true
        },
        {
            name: "Google",
            type: "select",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            timeout: 3000,
            proxies: ["PROXY"],
            "include-all": true
        },
        {
            name: "Streaming",
            type: "select",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            timeout: 3000,
            proxies: ["PROXY"],
            "include-all": true
        },
        {
            name: "AI",
            type: "select",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            timeout: 3000,
            proxies: ["PROXY"],
            "include-all": true
        },
        {
            name: "Telegram",
            type: "select",
            url: "http://www.gstatic.com/generate_204",
            interval: 600,
            timeout: 3000,
            proxies: ["PROXY"],
            "include-all": true
        }
    ];

    // 兼容性处理：如果有人写成 proxies: "PROXY"，把它转成数组（防御性）
    const cleaned = manualProxyGroups.map(g => {
        if (g.proxies && typeof g.proxies === "string") g.proxies = [g.proxies];
        // 如果 proxies 为空且是 PROXY 组，就把所有代理名填进去
		if ((!g.proxies || g.proxies.length === 0) && g.name === "PROXY") {
			if (allProxyNames && allProxyNames.length) {
				g.proxies = allProxyNames;
			} else {
				delete g.proxies;
			}
		}
        return g;
    });
    params["proxy-groups"] = cleaned;
}

// 覆写规则
function overwriteRules(params) {
    const ruleProviders = {
        icloud: {
            type: "http",
            behavior: "domain",
            url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/icloud.txt",
            path: "./ruleset/icloud.yaml",
            interval: 86400
        },
        apple: {
            type: "http",
            behavior: "domain",
            url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/apple.txt",
            path: "./ruleset/apple.yaml",
            interval: 86400
        },
        proxy: {
            type: "http",
            behavior: "domain",
            url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/proxy.txt",
            path: "./ruleset/proxy.yaml",
            interval: 86400
        },
        direct: {
            type: "http",
            behavior: "domain",
            url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/direct.txt",
            path: "./ruleset/direct.yaml",
            interval: 86400
        },
        "private": {
            type: "http",
            behavior: "domain",
            url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/private.txt",
            path: "./ruleset/private.yaml",
            interval: 86400
        },
        gfw: {
            type: "http",
            behavior: "domain",
            url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/gfw.txt",
            path: "./ruleset/gfw.yaml",
            interval: 86400
        },
        "tld-not-cn": {
            type: "http",
            behavior: "domain",
            url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/tld-not-cn.txt",
            path: "./ruleset/tld-not-cn.yaml",
            interval: 86400
        },
        cncidr: {
            type: "http",
            behavior: "ipcidr",
            url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/cncidr.txt",
            path: "./ruleset/cncidr.yaml",
            interval: 86400
        },
        lancidr: {
            type: "http",
            behavior: "ipcidr",
            url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/lancidr.txt",
            path: "./ruleset/lancidr.yaml",
            interval: 86400
        },
        applications: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/applications.txt",
            path: "./ruleset/applications.yaml",
            interval: 86400
        },
        ai: {
            type: "http",
            behavior: "domain",
            url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ai-!cn.yaml",
            path: "./ruleset/ai.yaml",
            interval: 86400
        },
        x_domain: {
            type: "http",
            behavior: "domain",
            url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/x.yaml",
            path: "./ruleset/x_domain.yaml",
            interval: 86400
        },
        streaming: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GlobalMedia/GlobalMedia_Classical_No_Resolve.yaml",
            path: "./ruleset/streaming.yaml",
            interval: 86400
        },
        google_domain: {
            type: "http",
            behavior: "domain",
            url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.yaml",
            path: "./ruleset/google_domain.yaml",
            interval: 86400
        },
        google_ip: {
            type: "http",
            behavior: "ipcidr",
            url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/google.yaml",
            path: "./ruleset/google_ip.yaml",
            interval: 86400
        },
        telegram_domain: {
            type: "http",
            behavior: "domain",
            url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.yaml",
            path: "./ruleset/telegram_domain.yaml",
            interval: 86400
        },
        telegram_ip: {
            type: "http",
            behavior: "ipcidr",
            url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.yaml",
            path: "./ruleset/telegram_ip.yaml",
            interval: 86400
        }
    };

    const rules = [
        "DOMAIN,update.miui.com,REJECT",
        "DOMAIN-SUFFIX,steamcontent.com,DIRECT",
        "DOMAIN-SUFFIX,adobe.io,REJECT",
        "DOMAIN-SUFFIX,adobe.com,REJECT",
        "DOMAIN-KEYWORD,adobe,REJECT",
        "RULE-SET,ai,AI",
        "RULE-SET,x_domain,Twitter",
        "RULE-SET,telegram_domain,Telegram",
        "RULE-SET,telegram_ip,Telegram,no-resolve",
        "RULE-SET,streaming,Streaming",
        "RULE-SET,google_domain,Google",
        "RULE-SET,google_ip,Google,no-resolve",
        "RULE-SET,applications,DIRECT",
        "DOMAIN,clash.razord.top,DIRECT",
        "DOMAIN,yacd.haishan.me,DIRECT",
        "RULE-SET,private,DIRECT",
        "RULE-SET,icloud,DIRECT",
        "RULE-SET,apple,DIRECT",
        "RULE-SET,proxy,PROXY",
        "RULE-SET,direct,DIRECT",
        "RULE-SET,lancidr,DIRECT,no-resolve",
        "RULE-SET,cncidr,DIRECT,no-resolve",
        "GEOIP,LAN,DIRECT,no-resolve",
        "GEOIP,CN,DIRECT,no-resolve",
        "MATCH,PROXY"
    ];

    params["rule-providers"] = ruleProviders;
    params["rules"] = rules;
}
