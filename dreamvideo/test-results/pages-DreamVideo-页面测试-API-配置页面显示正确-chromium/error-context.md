# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e5]:
        - link "返回" [ref=e6] [cursor=pointer]:
          - /url: /settings
          - button "返回" [ref=e7]:
            - img [ref=e8]
            - text: 返回
        - heading "API 配置" [level=1] [ref=e10]
    - main [ref=e11]:
      - generic [ref=e12]:
        - button "添加 API 配置" [ref=e13]:
          - img [ref=e14]
          - text: 添加 API 配置
        - generic [ref=e15]:
          - img [ref=e17]
          - heading "暂无 API 配置" [level=2] [ref=e21]
          - paragraph [ref=e22]: 添加 API 配置后即可开始创作视频
  - alert [ref=e23]
```