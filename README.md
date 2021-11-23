//安装依赖 
### `yarn ` 


//启动
### `yarn start` 




功能：实现一个有界面的五子棋交互式游戏。

## AI策略接口

1. 判断当前局面赢家

   ````typescript
   const is_win = (board: number[][]): number
   
   /**
   board: 一个棋盘大小的二维数组，数组中元素代表当前位置是第几个落子（从1开始），若空为0
   return: 1黑棋赢，-1白棋赢，0无人赢
   示例
   import is_win from "./strategy/win"
   let board = [
       [0, 0, 7, 8, 0],
       [0, 9, 0, 10, 0],
       [0, 0, 1, 2, 0],
       [0, 0, 3, 4, 0],
       [0, 0, 5, 6, 0]
   ];
   console.log(is_win(board));
   >> -1
   **/
   
   ````
2. 获取ai策略的下一步棋

   ```typescript
   const next_move = (board: number[][]): [number, number] 
   /**
   board: 一个棋盘大小的二维数组，数组中元素代表当前位置是第几个落子（从1开始），若空为0
   return: ai策略下一步的坐标，[x,y]，x代表行，y代表列（从0开始）
   示例
   import next_move from "./ai"
   let board = [
       [0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0],
       [0, 0, 1, 0, 0],
       [0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0]
   ];
   console.log(next_move(board));
   >> [2,1]
   代表ai选择走中心点左边的位置
   **/
   ```

## 待完成

* 前端显示界面
    * 界面
    
    * 可以选择人机和机器自我对战
    
    * 最后一个落子特殊标记
    
    * 图片均在images中
    
      ![](images/screen.png)
* strategy代码debug，优化
