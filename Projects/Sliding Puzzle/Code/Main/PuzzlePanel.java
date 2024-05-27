//William Poston
//05-05-2024

package main;

import javax.swing.JPanel;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.Timer;
import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.awt.Color;
import java.awt.Font;
import java.awt.Dimension;
import java.util.Collections;
import java.util.ArrayList;

public class PuzzlePanel extends JPanel {

    private static final long serialVersionUID = 1L;
    private int puzzleSize;
    private JButton[][] buttons;
    private int[] puzzle;
    private JComboBox<Integer> sizeSelector;
    private JPanel puzzleGridPanel;
    private JLabel moveCounterLabel;
    private JLabel timerLabel;
    private int moveCount;
    private Timer timer;
    private long startTime;

    public PuzzlePanel() {
        setLayout(new BorderLayout());

        // Create the menu panel for size selection and start button
        JPanel menuPanel = new JPanel();
        initializeMenu(menuPanel);
        add(menuPanel, BorderLayout.NORTH);

        // Create the panel for the puzzle grid
        puzzleGridPanel = new JPanel();
        add(puzzleGridPanel, BorderLayout.CENTER);

        // Create the panel for the move counter and timer
        JPanel statusPanel = new JPanel();
        initializeStatusPanel(statusPanel);
        add(statusPanel, BorderLayout.SOUTH);
    }

    private void initializeMenu(JPanel menuPanel) {
        JLabel label = new JLabel("Select Puzzle Size:");
        menuPanel.add(label);

        Integer[] sizes = { 3, 4, 5 };
        sizeSelector = new JComboBox<>(sizes);
        sizeSelector.setSelectedItem(4); // Default size is 4x4
        menuPanel.add(sizeSelector);

        JButton startButton = new JButton("Start Game");
        startButton.addActionListener(e -> startGame());
        menuPanel.add(startButton);
    }

    private void initializeStatusPanel(JPanel statusPanel) {
        moveCounterLabel = new JLabel("Moves: 0");
        statusPanel.add(moveCounterLabel);

        timerLabel = new JLabel("Time: 00:00");
        statusPanel.add(timerLabel);
    }

    private void startGame() {
        puzzleGridPanel.removeAll();

        puzzleSize = (Integer) sizeSelector.getSelectedItem();
        puzzleGridPanel.setLayout(new GridLayout(puzzleSize, puzzleSize));

        buttons = new JButton[puzzleSize][puzzleSize];
        puzzle = new int[puzzleSize * puzzleSize];
        initializePuzzle();

        moveCount = 0;
        moveCounterLabel.setText("Moves: " + moveCount);

        if (timer != null) {
            timer.stop();
        }
        timer = new Timer(1000, e -> updateTimer());
        timer.start();
        startTime = System.currentTimeMillis();

        puzzleGridPanel.revalidate();
        puzzleGridPanel.repaint();
    }

    private void initializePuzzle() {
        for (int i = 0; i < puzzleSize * puzzleSize - 1; i++) {
            puzzle[i] = i + 1;
        }
        puzzle[puzzleSize * puzzleSize - 1] = 0;

        do {
            shufflePuzzle();
        } while (!isSolvable());

        int k = 0;
        for (int i = 0; i < puzzleSize; i++) {
            for (int j = 0; j < puzzleSize; j++) {
                buttons[i][j] = new JButton();
                buttons[i][j].setFont(new Font("Arial", Font.BOLD, 20)); // Set font size
                buttons[i][j].setPreferredSize(new Dimension(100, 100)); // Set button size
                if (puzzle[k] == 0) {
                    buttons[i][j].setText("");
                } else {
                    buttons[i][j].setText(String.valueOf(puzzle[k]));
                }
                buttons[i][j].addActionListener(e -> moveTile((JButton) e.getSource()));
                puzzleGridPanel.add(buttons[i][j]);
                updateButtonColor(i, j);
                k++;
            }
        }
    }

    private void shufflePuzzle() {
        ArrayList<Integer> list = new ArrayList<>();
        for (int i = 0; i < puzzleSize * puzzleSize; i++) {
            list.add(puzzle[i]);
        }
        Collections.shuffle(list);
        for (int i = 0; i < puzzleSize * puzzleSize; i++) {
            puzzle[i] = list.get(i);
        }
    }

    private boolean isSolvable() {
        int inversions = 0;
        for (int i = 0; i < puzzleSize * puzzleSize - 1; i++) {
            for (int j = i + 1; j < puzzleSize * puzzleSize; j++) {
                if (puzzle[i] != 0 && puzzle[j] != 0 && puzzle[i] > puzzle[j]) {
                    inversions++;
                }
            }
        }

        if (puzzleSize % 2 == 1) { // odd grid
            return inversions % 2 == 0;
        } else { // even grid
            int emptyRow = 0;
            for (int i = 0; i < puzzleSize * puzzleSize; i++) {
                if (puzzle[i] == 0) {
                    emptyRow = i / puzzleSize + 1;
                }
            }
            return (inversions + emptyRow) % 2 == 1;
        }
    }

    private void moveTile(JButton clickedButton) {
        int emptyRow = -1, emptyCol = -1, clickedRow = -1, clickedCol = -1;

        for (int i = 0; i < puzzleSize; i++) {
            for (int j = 0; j < puzzleSize; j++) {
                if (buttons[i][j].getText().isEmpty()) {
                    emptyRow = i;
                    emptyCol = j;
                }
                if (buttons[i][j] == clickedButton) {
                    clickedRow = i;
                    clickedCol = j;
                }
            }
        }

        if (Math.abs(emptyRow - clickedRow) + Math.abs(emptyCol - clickedCol) == 1) {
            buttons[emptyRow][emptyCol].setText(clickedButton.getText());
            clickedButton.setText("");
            updateButtonColor(emptyRow, emptyCol);
            updateButtonColor(clickedRow, clickedCol);
            moveCount++;
            moveCounterLabel.setText("Moves: " + moveCount);
            if (isPuzzleSolved()) {
                turnTilesGreen();
                displayCongratulatoryMessage();
                timer.stop();
            }
        }
    }

    private void updateButtonColor(int row, int col) {
        String text = buttons[row][col].getText();
        if (!text.isEmpty() && Integer.parseInt(text) == row * puzzleSize + col + 1) {
            buttons[row][col].setBackground(Color.ORANGE);
        } else {
            buttons[row][col].setBackground(null);
        }
    }

    private boolean isPuzzleSolved() {
        for (int i = 0; i < puzzleSize; i++) {
            for (int j = 0; j < puzzleSize; j++) {
                String text = buttons[i][j].getText();
                if (!text.isEmpty() && Integer.parseInt(text) != i * puzzleSize + j + 1) {
                    return false;
                }
            }
        }
        return true;
    }

    private void turnTilesGreen() {
        for (int i = 0; i < puzzleSize; i++) {
            for (int j = 0; j < puzzleSize; j++) {
                buttons[i][j].setBackground(Color.GREEN);
            }
        }
    }

    private void displayCongratulatoryMessage() {
        JOptionPane.showMessageDialog(this, "Congratulations! You solved the puzzle!", "Puzzle Solved", JOptionPane.INFORMATION_MESSAGE);
    }

    private void updateTimer() {
        long elapsedTime = System.currentTimeMillis() - startTime;
        int seconds = (int) (elapsedTime / 1000) % 60;
        int minutes = (int) ((elapsedTime / (1000 * 60)) % 60);
        timerLabel.setText(String.format("Time: %02d:%02d", minutes, seconds));
    }
}
