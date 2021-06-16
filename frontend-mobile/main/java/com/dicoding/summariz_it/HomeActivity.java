package com.dicoding.summariz_it;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.AssetFileDescriptor;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.MimeTypeMap;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.dicoding.summariz_it.db.SummaryDBHelper;
import com.dicoding.summariz_it.model.Summary;
import com.dicoding.summariz_it.utils.Grapher;
import com.dicoding.summariz_it.utils.PreProcessor;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class HomeActivity extends AppCompatActivity {
    private static final String TAG = "HomeActivity";
    private final int STORAGE_PERMISSION_CODE = 1;
    private final int FILE_REQUEST_CODE = 100;
    private HashMap<String, String> summaryMap;
    private EditText editTextView;
    private String documentText;
    private ListView listView;
    private Button summaryButton;
    private ProgressBar progressBar;
    public static PreProcessor preProcessor;
    public static Grapher grapher;
    private SummaryDBHelper dbHelper;
    AsyncTask<Void, Void, String> load;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        editTextView = findViewById(R.id.editText);
        summaryButton = findViewById(R.id.summaryButton);
        summaryButton.setEnabled(false);
        summaryButton.setVisibility(View.INVISIBLE);
        progressBar = findViewById(R.id.progressBar);
        dbHelper = new SummaryDBHelper(this);

        FloatingActionButton fab = findViewById(R.id.fab);
        fab.setImageDrawable(ContextCompat.getDrawable(HomeActivity.this, R.drawable.fileplus));
        fab.setOnClickListener(view -> {
            if (ContextCompat.checkSelfPermission(HomeActivity.this,
                    Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
                Log.i(TAG, "onClick: App has storage permission");
                Intent fileIntent = new Intent(Intent.ACTION_GET_CONTENT);
                fileIntent.setType("text/plain");
                startActivityForResult(fileIntent, FILE_REQUEST_CODE);
            } else {
                Log.i(TAG, "onClick: Requesting Storage permission");
                requestStoragePermission();
            }
        });

        Button testButton = findViewById(R.id.testButton);
        testButton.setOnClickListener(v -> {
            Log.i(TAG, "onClick: Read test doc");
            editTextView.setText(readText(getApplicationContext().getResources().openRawResource(R.raw.gutenberg)));
        });

        summaryButton.setOnClickListener(v -> {
            if (!editTextView.getText().toString().isEmpty()) {
                Intent summaryIntent = new Intent(HomeActivity.this, SummaryActivity.class);
                summaryIntent.putExtra("docText", editTextView.getText().toString());
                startActivity(summaryIntent);
            } else {
                Toast.makeText(HomeActivity.this, "Nothing to Summarize", Toast.LENGTH_SHORT).show();
            }
        });

        listView = new ListView(this);
        listView.setPadding(16, 16, 16, 16);
        listView.setOnItemClickListener((parent, view, position, id) -> {
            Log.i(TAG, "onItemClick: Selected index " + position);
            String name = parent.getItemAtPosition(position).toString();
            if (summaryMap.containsKey(name)) {
                Intent openIntent = new Intent(HomeActivity.this, SummaryActivity.class);
                openIntent.putExtra("open", summaryMap.get(name));
                startActivity(openIntent);
            }
        });
        if (load != null)
            load.cancel(true);
        load = new LoadModels();
        load.execute();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (load != null)
            load.cancel(true);
    }

    private void summaryInit() throws Exception {
        InputStream sentInput = getAssets().open("en_sent.bin");
        InputStream tokenInput = getAssets().open("en_token.bin");
        InputStream lemmaInput = getAssets().open("en_lemming.dict");
        System.setProperty("org.xml.sax.driver", "org.pull.v1.sax2.Driver");
        AssetFileDescriptor assetFileDescriptor = getResources().openRawResourceFd(R.raw.en_pos_maxent);
        FileInputStream posInput = assetFileDescriptor.createInputStream();
        preProcessor = new PreProcessor(sentInput, tokenInput, lemmaInput, posInput);
        grapher = new Grapher();
        sentInput.close();
        tokenInput.close();
        lemmaInput.close();
        posInput.close();
    }

    public String readText(InputStream input) {
        InputStreamReader reader = new InputStreamReader(input);
        BufferedReader buffReader = new BufferedReader(reader);
        String line;
        StringBuilder text = new StringBuilder();
        try {
            while ((line = buffReader.readLine()) != null) {
                text.append(line);
                text.append('\n');
            }
            input.close();
            reader.close();
            buffReader.close();
        } catch (IOException e) {
            Log.i(TAG, "onClick: Exception: " + e.getMessage());
        }
        return text.toString();
    }

    private void requestStoragePermission() {
        if (ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.READ_EXTERNAL_STORAGE)) {
            new AlertDialog.Builder(this)
                    .setTitle("Permission needed")
                    .setMessage("This permission is needed to upload a document from your device.")
                    .setPositiveButton("OK", (dialog, which) -> ActivityCompat.requestPermissions(HomeActivity.this, new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, STORAGE_PERMISSION_CODE))
                    .setNegativeButton("DISMISS", (dialog, which) -> {
                        dialog.dismiss();
                        Log.i(TAG, "onClick: Rationale dismissed");
                    }).create().show();
        } else {
            ActivityCompat.requestPermissions(HomeActivity.this, new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, STORAGE_PERMISSION_CODE);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == STORAGE_PERMISSION_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Permission granted", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Permission denied", Toast.LENGTH_SHORT).show();
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (data != null) {
            if (data.getData() != null) {
                String mimeType = getContentResolver().getType(data.getData());
                String extension = MimeTypeMap.getSingleton().getExtensionFromMimeType(mimeType);
                Log.i(TAG, "onActivityResult: File Extension = " + extension);
                if (extension != null && extension.equals("txt")) {
                    try {
                        documentText = readText(getContentResolver().openInputStream(data.getData()));
                        editTextView.setText(documentText);
                    } catch (FileNotFoundException e) {
                        Log.e(TAG, "onActivityResult: ", e);
                        Toast.makeText(this, "File Not Found", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(this, "Wrong file extension, try a .txt file.", Toast.LENGTH_SHORT).show();
                }
            } else {
                Toast.makeText(this, "Could not get file text.", Toast.LENGTH_SHORT).show();
                Log.i(TAG, "onActivityResult: Data Uri is null.");
            }
            if (documentText != null) {
                Log.i(TAG, "onActivityResult: Document Content: " + documentText);
            } else {
                Toast.makeText(this, "No text to summarize", Toast.LENGTH_SHORT).show();
            }
        } else {
            Toast.makeText(this, "Nothing to Summarize", Toast.LENGTH_SHORT).show();
            Log.i(TAG, "onActivityResult: Data is null.");
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater menuInflater = getMenuInflater();
        menuInflater.inflate(R.menu.open_summary_menu, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        super.onOptionsItemSelected(item);
        if (item.getItemId() == R.id.openSummaryMenu) {
            getSavedSummaries();
            showOpenDialog();
            return true;
        } else if (item.getItemId() == R.id.clearEditText) {
            editTextView.getText().clear();
            return true;
        }
        return false;
    }

    private void getSavedSummaries() {
        List<Summary> summaries = dbHelper.getAllSummaries();
        summaryMap = new HashMap<>();
        for (Summary s : summaries) {
            summaryMap.put(s.getName(), s.getText());
        }
    }

    private void showOpenDialog() {
        ArrayList<String> summaryNameList = new ArrayList<>(summaryMap.keySet());
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this,
                R.layout.support_simple_spinner_dropdown_item,
                summaryNameList);
        listView.setPadding(8, 8, 8, 8);
        listView.setAdapter(adapter);
        Log.i(TAG, "showOpenDialog: adapter notified");
        if (summaryNameList.isEmpty()) {
            Toast.makeText(this, "No saved Summaries", Toast.LENGTH_SHORT).show();
        } else {
            AlertDialog.Builder builder = new AlertDialog.Builder(HomeActivity.this);
            if (listView.getParent() != null) {
                ((ViewGroup) listView.getParent()).removeView(listView);
            }
            builder.setTitle("Open Summary")
                    .setCancelable(true)
                    .setNegativeButton("cancel", null);
            AlertDialog openDialog = builder.create();
            openDialog.setView(listView, 16, 16, 16, 16);
            openDialog.show();
        }
    }

    @SuppressLint("StaticFieldLeak")
    private class LoadModels extends AsyncTask<Void, Void, String> {
        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            Toast.makeText(HomeActivity.this, "Loading summary tools...", Toast.LENGTH_LONG).show();
        }

        @Override
        protected String doInBackground(Void... voids) {
            try {
                summaryInit();
            } catch (Exception e) {
                e.printStackTrace();
            }
            return "Summarizer Ready";
        }

        @Override
        protected void onPostExecute(String result) {
            Toast.makeText(HomeActivity.this, result, Toast.LENGTH_SHORT).show();
            progressBar.setVisibility(View.GONE);
            summaryButton.setVisibility(View.VISIBLE);
            summaryButton.setEnabled(true);
        }
    }
}
